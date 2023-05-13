package com.megafarad.omoiomoi.model

import java.time.Instant
import java.util.UUID

case class MeetingRecord(id: UUID, roomName: String, startTime: Instant, endTime: Option[Instant])

case class MeetingParticipantRecord(id: String, name: String, email: Option[String], json: String)

case class MeetingEventRecord(id: UUID, recordType: String, meetingRecordId: UUID, participantRecordId: Option[String],
                              timestamp: Instant, transcribedText: Option[String], json: String)
