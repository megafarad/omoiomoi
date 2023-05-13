package com.megafarad.omoiomoi.binders

import play.api.Logging
import play.api.mvc.QueryStringBindable

import java.time.format.DateTimeParseException
import java.time.zone.ZoneRulesException
import java.time.{LocalDate, ZoneId}

object CustomBinders extends Logging {
  implicit def localDateBinder(implicit stringBinder: QueryStringBindable[String]): QueryStringBindable[LocalDate] = new QueryStringBindable[LocalDate] {
    override def bind(key: String, params: Map[String, Seq[String]]): Option[Either[String, LocalDate]] = {
      params.get(key).map {
        dateString =>
          try {
            Right(LocalDate.parse(dateString.head))
          } catch {
            case _: DateTimeParseException => Left("Not a valid date")
          }
      }
    }

    override def unbind(key: String, value: LocalDate): String = stringBinder.unbind(key, value.toString)
  }

  implicit def zoneIdBinder(implicit stringBinder: QueryStringBindable[String]): QueryStringBindable[ZoneId] = new QueryStringBindable[ZoneId] {
    override def bind(key: String, params: Map[String, Seq[String]]): Option[Either[String, ZoneId]] = {
      params.get(key).map {
        dateString => try {
          Right(ZoneId.of(dateString.head))
        } catch {
          case _: DateTimeParseException => Left("Not a valid ZoneId")
          case _: ZoneRulesException => Left("ZoneId not found")
        }
      }
    }

    override def unbind(key: String, value: ZoneId): String = stringBinder.unbind(key, value.toString)
  }
}
