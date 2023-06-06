package com.megafarad.omoiomoi.model

import play.api.libs.json._
import play.api.libs.functional.syntax._

import java.time.Instant
import java.util.UUID

case class MeetingListing(id: UUID, roomName: String, startTime: Instant)

object MeetingListing {
  implicit val meetingListingWrites: Writes[MeetingListing] = (
    (JsPath \ "id").write[UUID] and
      (JsPath \ "room_name").write[String] and
      (JsPath \ "start_time").write[Instant]
  )(unlift(MeetingListing.unapply))

  implicit val meetingListingPageWrites: Writes[Page[MeetingListing]] = Json.writes[Page[MeetingListing]]
}