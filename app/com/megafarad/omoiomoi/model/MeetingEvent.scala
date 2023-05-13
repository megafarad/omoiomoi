package com.megafarad.omoiomoi.model

import play.api.libs.json._
import play.api.libs.functional.syntax._

import java.time.Instant

sealed trait MeetingEvent
case class BlankEvent(roomName: String) extends MeetingEvent
case class StartEvent(roomName: String, timestamp: Instant) extends MeetingEvent
case class JoinEvent(roomName: String, participant: Participant, timestamp: Instant) extends MeetingEvent
case class SpeechEvent(roomName: String, transcript: Seq[TranscriptAlternative], isInterim: Boolean, language: String,
                       messageId: String, `type`: String, participant: Participant, stability: Double,
                       timestamp: Instant) extends MeetingEvent
case class LeaveEvent(roomName: String, participant: Participant, timestamp: Instant) extends MeetingEvent
case class EndEvent(roomName: String, timestamp: Instant) extends MeetingEvent

case class Participant(avatarUrl: String, name: String, id: String, email: Option[String])

case class TranscriptAlternative(confidence: Double, text: String)

object MeetingEvent {

  implicit val participantReads: Reads[Participant] = (
    (JsPath \ "avatar_url").read[String] and
      (JsPath \ "name").read[String] and
      (JsPath \ "id").read[String] and
      (JsPath \ "email").readNullable[String])(Participant.apply _)

  implicit val participantWrites: Writes[Participant] = (
    (JsPath \ "avatar_url").write[String] and
      (JsPath \ "name").write[String] and
      (JsPath \ "id").write[String] and
      (JsPath \ "email").writeNullable[String]
  )(unlift(Participant.unapply))

  implicit val transcriptAlternativeReads: Reads[TranscriptAlternative] = (
    (JsPath \ "confidence").read[Double] and
      (JsPath \ "text").read[String])(TranscriptAlternative.apply _)

  implicit val transcriptAlternativeWrites: Writes[TranscriptAlternative] = (
    (JsPath \ "confidence").write[Double] and
      (JsPath \ "text").write[String]
  )(unlift(TranscriptAlternative.unapply))

  implicit val blankEventReads: Reads[BlankEvent] = (JsPath \ "room_name").read[String].map(BlankEvent)

  implicit val blankEventWrites: Writes[BlankEvent] = Writes {
    event => Json.obj(
      "room_name" -> event.roomName
    )
  }

  implicit val startEventReads: Reads[StartEvent] = (
    (JsPath \ "room_name").read[String] and
      (JsPath \ "timestamp").read[Instant])(StartEvent.apply _)

  implicit val startEventWrites: Writes[StartEvent] = Writes {
    event => Json.obj(
      "room_name" -> event.roomName,
      "timestamp" -> event.timestamp,
      "event" -> "START"
    )
  }

  implicit val joinEventReads: Reads[JoinEvent] =
    ((JsPath \ "room_name").read[String] and
      (JsPath \ "participant").read[Participant] and
      (JsPath \ "timestamp").read[Instant])(JoinEvent.apply _)

  implicit val joinEventWrites: Writes[JoinEvent] = Writes {
    event => Json.obj(
      "room_name" -> event.roomName,
      "participant" -> event.participant,
      "timestamp" -> event.timestamp,
      "event" -> "JOIN"
    )
  }

  implicit val speechEventReads: Reads[SpeechEvent] = (
    (JsPath \ "room_name").read[String] and
      (JsPath \ "transcript").read[Seq[TranscriptAlternative]] and
      (JsPath \ "is_interim").read[Boolean] and
      (JsPath \ "language").read[String] and
      (JsPath \ "message_id").read[String] and
      (JsPath \ "type").read[String] and
      (JsPath \ "participant").read[Participant] and
      (JsPath \ "stability").read[Double] and
      (JsPath \ "timestamp").read[Instant])(SpeechEvent.apply _)

  implicit val speechEventWrites: Writes[SpeechEvent] = Writes {
    event => Json.obj(
      "room_name" -> event.roomName,
      "transcript" -> event.transcript,
      "is_interim" -> event.isInterim,
      "language" -> event.language,
      "message_id" -> event.messageId,
      "type" -> event.`type`,
      "participant" -> event.participant,
      "stability" -> event.stability,
      "timestamp" -> event.timestamp,
      "event" -> "SPEECH"
    )
  }

  implicit val leaveEventReads: Reads[LeaveEvent] =
    ((JsPath \ "room_name").read[String] and
      (JsPath \ "participant").read[Participant] and
      (JsPath \ "timestamp").read[Instant])(LeaveEvent.apply _)

  implicit val leaveEventWrites: Writes[LeaveEvent] = Writes {
    event =>
      Json.obj(
        "room_name" -> event.roomName,
        "participant" -> event.participant,
        "timestamp" -> event.timestamp,
        "event" -> "LEAVE"
      )
  }

  implicit val endEventReads: Reads[EndEvent] = (
    (JsPath \ "room_name").read[String] and
      (JsPath \ "timestamp").read[Instant])(EndEvent.apply _)

  implicit val endEventWrites: Writes[EndEvent] = Writes {
    event =>
      Json.obj(
        "room_name" -> event.roomName,
        "timestamp" -> event.timestamp,
        "event" -> "END"
      )
  }

  implicit val eventReads: Reads[MeetingEvent] = Reads {
    case jsValue@JsObject(underlying) => underlying.getOrElse("event", JsString("BLANK")) match {
      case JsString("BLANK") => blankEventReads.reads(jsValue)
      case JsString("START") => startEventReads.reads(jsValue)
      case JsString("JOIN") => joinEventReads.reads(jsValue)
      case JsString("SPEECH") => speechEventReads.reads(jsValue)
      case JsString("LEAVE") => leaveEventReads.reads(jsValue)
      case JsString("END") => endEventReads.reads(jsValue)
      case _ => JsError("Unable to parse")
    }
    case _ => JsError("Unable to parse")
  }

  implicit val eventWrites: Writes[MeetingEvent] = Writes {
    case e: BlankEvent => blankEventWrites.writes(e)
    case e: StartEvent => startEventWrites.writes(e)
    case e: JoinEvent => joinEventWrites.writes(e)
    case e: SpeechEvent => speechEventWrites.writes(e)
    case e: LeaveEvent => leaveEventWrites.writes(e)
    case e: EndEvent => endEventWrites.writes(e)
  }

}
