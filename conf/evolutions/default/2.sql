-- !Ups

ALTER TABLE Meeting_Event
ADD COLUMN search_field tsvector;

UPDATE Meeting_Event
SET search_field = to_tsvector(transcribed_text);

CREATE INDEX meeting_event_search_field_idx ON Meeting_Event USING GIN(search_field);

CREATE FUNCTION update_search_field() RETURNS trigger AS $$
BEGIN
    NEW.search_field := to_tsvector(NEW.transcribed_text);;
    RETURN NEW;;
END;;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_search_field
BEFORE INSERT OR UPDATE ON Meeting_Event
FOR EACH ROW EXECUTE FUNCTION update_search_field();

-- !Downs

DROP INDEX meeting_event_search_field_idx;
DROP FUNCTION update_search_field();
ALTER TABLE Meeting_Event
DROP COLUMN search_field;