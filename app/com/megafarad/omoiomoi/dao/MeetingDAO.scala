package com.megafarad.omoiomoi.dao

import com.megafarad.omoiomoi.model._
import com.megafarad.omoiomoi.model.MeetingEvent._
import play.api.db.slick._
import MyPostgresProfile.api._
import com.github.tminglei.slickpg.TsVector
import play.api.libs.json.Json
import slick.jdbc.JdbcProfile

import java.time.{Instant, LocalDate, LocalTime, ZoneId, ZonedDateTime}
import java.util.UUID
import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class MeetingDAO @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit val ec: ExecutionContext) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._

  private class MeetingTable(tag: Tag) extends Table[MeetingRecord](tag, "meeting") {
    def id = column[UUID]("id", O.PrimaryKey, O.SqlType("UUID"))
    def roomName = column[String]("room_name")
    def startTime = column[Instant]("start_time")
    def endTime = column[Option[Instant]]("end_time")

    def * = (id, roomName, startTime, endTime) <> (MeetingRecord.tupled, MeetingRecord.unapply)
  }

  private val meetingTable = TableQuery[MeetingTable]

  private class MeetingParticipantTable(tag: Tag) extends Table[MeetingParticipantRecord](tag, "meeting_participant") {
    def id = column[String]("id", O.PrimaryKey, O.SqlType("VARCHAR(8)"))
    def name = column[String]("name")
    def email = column[Option[String]]("email")
    def json = column[String]("json", O.SqlType("text"))
    override def * = (id, name, email, json) <> (MeetingParticipantRecord.tupled, MeetingParticipantRecord.unapply)
  }

  private val meetingParticipantTable = TableQuery[MeetingParticipantTable]

  private class MeetingEventTable(tag: Tag) extends Table[MeetingEventRecord](tag, "meeting_event") {
    def id = column[UUID]("id", O.PrimaryKey, O.SqlType("UUID"))
    def recordType = column[String]("record_type")
    def meetingRecordId = column[UUID]("meeting_record_id", O.SqlType("UUID"))
    def participantRecordId = column[Option[String]]("participant_record_id", O.SqlType("VARCHAR(8)"))
    def timestamp = column[Instant]("timestamp")
    def transcribedText = column[Option[String]]("transcribed_text", O.SqlType("text"))
    def searchField = column[TsVector]("search_field")
    def json = column[String]("json", O.SqlType("text"))

    override def * = (id, recordType, meetingRecordId, participantRecordId, timestamp, transcribedText, json) <>
      (MeetingEventRecord.tupled, MeetingEventRecord.unapply)

    def meeting = foreignKey("MEETING_FK", meetingRecordId, meetingTable)(_.id)
    def participant = foreignKey("PARTICIPANT_FK", participantRecordId, meetingParticipantTable)(_.id.?)
  }

  private val meetingEventTable = TableQuery[MeetingEventTable]

  def handleEvent(meetingEvent: MeetingEvent): Future[Unit] = {
    meetingEvent match {
      case BlankEvent(_) =>
        //Event is ignored
        Future.successful(())
      case e@StartEvent(roomName, timestamp) =>
        val json = Json.toJson(e).toString()
        val meeting = MeetingRecord(id = UUID.randomUUID(), roomName = roomName, startTime = timestamp, endTime = None)
        val meetingEvent = MeetingEventRecord(id = UUID.randomUUID(), recordType = "START",
          meetingRecordId = meeting.id, participantRecordId = None, timestamp = timestamp, transcribedText = None,
          json = json)
        db.run(
          DBIO.seq(
            meetingTable += meeting,
            meetingEventTable += meetingEvent
          ).transactionally
        )
      case e@JoinEvent(roomName, participant, timestamp) =>
        getCurrentMeeting(roomName) flatMap {
          case Some(meetingRecord) =>
            val eventJson = Json.toJson(e).toString()
            val participantJson = Json.toJson(participant).toString()
            val meetingParticipantRecord = MeetingParticipantRecord(id = participant.id, name = participant.name,
              email = participant.email, json = participantJson)
            val meetingEventRecord = MeetingEventRecord(id = UUID.randomUUID(), recordType = "JOIN",
              meetingRecordId = meetingRecord.id, participantRecordId = Some(meetingParticipantRecord.id),
              timestamp = timestamp, transcribedText = None, json = eventJson)
            db.run(
              DBIO.seq(
                meetingParticipantTable.insertOrUpdate(meetingParticipantRecord),
                meetingEventTable += meetingEventRecord
              ).transactionally
            )
          case None => Future.failed(new Exception("No current meeting for " + roomName))
        }

      case e@SpeechEvent(roomName, transcript, _, _, _, _, participant, _, timestamp) =>
        getCurrentMeeting(roomName) flatMap {
          case Some(meetingRecord) =>
            val eventJson = Json.toJson(e).toString()
            val text = transcript.headOption.map(_.text)
            val meetingEventRecord = MeetingEventRecord(id = UUID.randomUUID(), recordType = "SPEECH",
              meetingRecordId = meetingRecord.id, participantRecordId = Some(participant.id), timestamp = timestamp,
              transcribedText = text, json = eventJson)
            db.run(meetingEventTable += meetingEventRecord).map(_ => ())
          case None => Future.failed(new Exception("No current meeting for " + roomName))
        }


      case e@LeaveEvent(roomName, participant, timestamp) =>
        if (participant.id.equals("focus")) {
          //Ignore
          Future.successful(())
        } else {
          getCurrentMeeting(roomName) flatMap {
            case Some(meetingRecord) =>
              val eventJson = Json.toJson(e).toString()
              val meetingEventRecord = MeetingEventRecord(id = UUID.randomUUID(), recordType = "LEAVE",
                meetingRecordId = meetingRecord.id, participantRecordId = Some(participant.id), timestamp = timestamp,
                transcribedText = None, json = eventJson)
              db.run(meetingEventTable += meetingEventRecord).map(_ => ())
            case None => Future.failed(new Exception("No current meeting for " + roomName))
          }
        }
      case e@EndEvent(roomName, timestamp) =>
        getCurrentMeeting(roomName) flatMap {
          case Some(meetingRecord) =>
            val eventJson = Json.toJson(e).toString()
            val meetingEventRecord = MeetingEventRecord(id = UUID.randomUUID(), recordType = "END",
              meetingRecordId = meetingRecord.id, participantRecordId = None, timestamp = timestamp,
              transcribedText = None, json = eventJson)
            db.run(
              DBIO.seq(
                meetingEventTable += meetingEventRecord,
                meetingTable.filter(_.id === meetingRecord.id).map(_.endTime).update(Some(timestamp))
              ).transactionally
            )
          case None => Future.failed(new Exception("No current meeting for " + roomName))
        }

    }
  }

  private def getCurrentMeeting(roomName: String): Future[Option[MeetingRecord]] = {
    db.run(meetingTable.filter(meetingRecord => meetingRecord.roomName === roomName &&
      meetingRecord.endTime.isEmpty).result.headOption)
  }

  private lazy val fullQuery = meetingTable.join(meetingEventTable).on(_.id === _.meetingRecordId)
    .joinLeft(meetingParticipantTable).on(_._2.participantRecordId === _.id.?)


  def getMeeting(meetingId: UUID, email: String): Future[Option[Meeting]] = {

    val matchingEvents = fullQuery.filter {
      case ((meeting, _), meetingParticipant) => meeting.id === meetingId && meetingParticipant.nonEmpty &&
        meetingParticipant.flatMap(_.email).map(_ === email)
    }
    val meetingsQuery = getDistinctMeetings(matchingEvents)
    for {
      meetingRecord <- db.run(meetingsQuery.result.headOption)
      meeting <- meetingRecord match {
        case Some(record) =>
          val meetingEventsQuery = fullQuery.filter {
            case ((meeting, _), _) => meeting.id === record.id
          }.sortBy {
            case ((_, meetingEvent), _) => meetingEvent.timestamp
          }
          db.run(meetingEventsQuery.result).map {
            meetingEventRecords =>
              val meetingEvents: Seq[MeetingEvent] = extractMeetingEvents(meetingEventRecords)
              val participants = extractParticipants(meetingEvents)
              Some(Meeting(id = record.id, roomName = record.roomName, startTime = record.startTime,
                endTime = record.endTime, participants = participants, events = meetingEvents))
          }
        case None => Future.successful(None)
      }
    } yield meeting
  }

  private def extractMeetingEvents(meetingEventRecords: Seq[((MeetingRecord, MeetingEventRecord), Option[MeetingParticipantRecord])]): Seq[MeetingEvent] = {
    meetingEventRecords.map {
      case ((_, meetingEvent), _) => Json.parse(meetingEvent.json).as[MeetingEvent]
    }
  }

  private def getDistinctMeetings(matchingEvents: Query[((MeetingTable, MeetingEventTable), Rep[Option[MeetingParticipantTable]]), ((MeetingRecord, MeetingEventRecord), Option[MeetingParticipantRecord]), Seq]): Query[MeetingTable, MeetingRecord, Seq] = {
    matchingEvents.map {
      case ((meeting, _), _) => meeting
    }.sortBy(m => (m.startTime, m.id)).distinctOn(m => (m.startTime, m.id))
  }

  private def convertToInstant(localDate: LocalDate, zoneId: Option[ZoneId]): Instant = {
    val zonedDateTime = ZonedDateTime.of(localDate, LocalTime.MIDNIGHT, zoneId.getOrElse(ZoneId.systemDefault()))
    Instant.from(zonedDateTime)
  }

  def getMeetingsByParticipantEmail(email: String,
                                    fromDate: Option[LocalDate],
                                    toDate: Option[LocalDate],
                                    timeZone: Option[ZoneId],
                                    page: Int = 0,
                                    pageSize: Int = 10): Future[Page[MeetingListing]] = {
    val offset = pageSize * page

    val matchingEvents = fullQuery.filter {
      case ((_, _), meetingParticipant) => meetingParticipant.nonEmpty &&
        meetingParticipant.flatMap(_.email).map(_ === email)
    }
    val fromInstant = fromDate.map(convertToInstant(_, timeZone))
    val toInstant = toDate.map(convertToInstant(_, timeZone))

    val meetingsQuery = getDistinctMeetings(matchingEvents)
    val meetingsFromDateQuery = fromInstant match {
      case Some(value) => meetingsQuery.filter {
        meeting => meeting.startTime >= value
      }
      case None => meetingsQuery
    }
    val meetingsToDateQuery = toInstant match {
      case Some(value) => meetingsFromDateQuery.filter {
        meeting => meeting.startTime <= value
      }
      case None => meetingsFromDateQuery
    }

    val meetingPageQuery = meetingsToDateQuery.drop(offset).take(pageSize)

    for {
      totalMeetings <- db.run(meetingsQuery.length.result)
      meetingRecords <- db.run(meetingPageQuery.result)
    } yield {
      val listings = meetingRecords.map(r => MeetingListing(r.id, r.roomName, r.startTime))
      Page[MeetingListing](listings, page, offset, totalMeetings)
    }
  }

  private def extractParticipants(meetingEvents: Seq[MeetingEvent]): Seq[Participant] = {
    meetingEvents.collect {
      case JoinEvent(_, participant, _) => participant
    }.distinct
  }

  def searchMeetingEvents(email: String, query: String, fromDate: Option[LocalDate], toDate: Option[LocalDate],
                          timeZone: Option[ZoneId], page: Int = 0, pageSize: Int = 10): Future[Page[SearchResult]] = {
    val offset = pageSize * page

    val matchingEventsQuery = fullQuery.filter {
      case ((_, _), meetingParticipant) => meetingParticipant.nonEmpty &&
        meetingParticipant.flatMap(_.email).map(_ === email)
    }

    val fromInstant = fromDate.map(convertToInstant(_, timeZone))
    val toInstant = toDate.map(convertToInstant(_, timeZone))

    val distinctMeetingsQuery = getDistinctMeetings(matchingEventsQuery)
    val meetingEventSearchQuery = distinctMeetingsQuery.join(meetingEventTable).on(_.id === _.meetingRecordId).filter {
      case (_, meetingEvent) => meetingEvent.searchField @@ webSearchToTsQuery(query)
    }
    val meetingEventFromDateQuery = fromInstant match {
      case Some(value) => meetingEventSearchQuery.filter {
        case (_, meetingEvent) => meetingEvent.timestamp >= value
      }
      case None => meetingEventSearchQuery
    }

    val meetingEventToDateQuery = toInstant match {
      case Some(value) => meetingEventFromDateQuery.filter {
        case (_, meetingEvent) => meetingEvent.timestamp <= value
      }
      case None => meetingEventFromDateQuery
    }

    val meetingEventRecordQuery = meetingEventToDateQuery.map {
      case (_, meetingEvent) => meetingEvent
    }

    val meetingEventRecordsPageQuery = meetingEventRecordQuery.drop(offset).take(pageSize)

    for {
      total <- db.run(meetingEventSearchQuery.length.result)
      meetingEventRecords <- db.run(meetingEventRecordsPageQuery.result)
    } yield {
      val items = meetingEventRecords map {
        meetingEventRecord =>
          SearchResult(meetingEventRecord.meetingRecordId, Json.parse(meetingEventRecord.json).as[MeetingEvent])
      }
      Page[SearchResult](items, page, offset, total)
    }
  }
}
