package com.megafarad.omoiomoi.model

import play.api.libs.functional.syntax._
import play.api.libs.json._

import java.util.UUID

case class SearchResult(meetingId: UUID, meetingEvent: MeetingEvent)

object SearchResult {
  import com.megafarad.omoiomoi.model.MeetingEvent._

  implicit val searchResultWrites: Writes[SearchResult] = (
    (JsPath \ "meeting_id").write[UUID] and
      (JsPath \ "meeting_event").write[MeetingEvent]
  )(unlift(SearchResult.unapply))

  implicit val searchPageWrites: Writes[Page[SearchResult]] = Json.writes[Page[SearchResult]]
}