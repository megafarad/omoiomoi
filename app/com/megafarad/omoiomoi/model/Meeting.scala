package com.megafarad.omoiomoi.model

import play.api.libs.json._
import play.api.libs.functional.syntax._

import java.time.Instant
import java.util.UUID

case class Meeting(id: UUID, roomName: String, startTime: Instant, endTime: Option[Instant], participants: Seq[Participant],
                   events: Seq[MeetingEvent])

object Meeting {
  import com.megafarad.omoiomoi.model.MeetingEvent._

  implicit val meetingWrites: Writes[Meeting] = (
      (JsPath \ "id" ).write[UUID] and
        (JsPath \ "room_name").write[String] and
        (JsPath \ "start_time").write[Instant] and
        (JsPath \ "end_time").writeNullable[Instant] and
        (JsPath \ "participants").write[Seq[Participant]] and
        (JsPath \ "events").write[Seq[MeetingEvent]]
    )(unlift(Meeting.unapply))

  implicit val meetingPageWrites: Writes[Page[Meeting]] = Json.writes[Page[Meeting]]

}

