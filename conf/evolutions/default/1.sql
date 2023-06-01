-- Meetings schema

-- !Ups

CREATE TABLE IF NOT EXISTS Meeting (
    id uuid not null,
    room_name varchar(255) not null,
    start_time timestamp not null,
    end_time timestamp,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS Meeting_Participant (
    id varchar(8) not null,
    name varchar(255) not null,
    email varchar(255),
    json text not null,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS Meeting_Event (
  id uuid not null,
  record_type varchar(10) not null,
  meeting_record_id uuid not null,
  participant_record_id varchar(8),
  timestamp timestamp,
  transcribed_text text,
  json text not null,
  primary key (id),
  constraint MEETING_FK
    foreign key(meeting_record_id)
        references Meeting(id),
  constraint PARTICIPANT_FK
    foreign key(participant_record_id)
        references Meeting_Participant(id)
);
