package com.megafarad.omoiomoi.controllers

import com.megafarad.omoiomoi.auth.AuthAction
import com.megafarad.omoiomoi.dao.MeetingDAO
import com.megafarad.omoiomoi.model.Meeting._
import com.megafarad.omoiomoi.model.MeetingListing._
import com.megafarad.omoiomoi.model.MeetingEvent._
import com.megafarad.omoiomoi.model.{Meeting, MeetingEvent, MeetingListing, Page, SearchResult}
import play.api._
import play.api.cache.AsyncCacheApi
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._

import java.time.{LocalDate, ZoneId}
import java.util.UUID
import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._


@Singleton
class TranscriptionController @Inject()(meetingDAO: MeetingDAO,
                                        cc: ControllerComponents,
                                        authAction: AuthAction,
                                        ws: WSClient,
                                        config: Configuration,
                                        cache: AsyncCacheApi)(implicit ec: ExecutionContext)
  extends AbstractController(cc) with Logging {

  def postMeetingEvent: Action[AnyContent] = Action.async { request: Request[AnyContent] =>
    request.body.asJson match {
      case Some(json) =>
        val parsedMeetingEvent = json.as[MeetingEvent]
        meetingDAO.handleEvent(parsedMeetingEvent).map(_ => NoContent)
      case None => Future.successful(BadRequest)
    }
  }

  private def getUserEmail(requestToken: String): Future[Either[Exception, String]] = {
    val token = "Bearer " + requestToken

    for {
      cachedEmail <- cache.get[String](token)
      email <- cachedEmail match {
        case Some(value) => Future.successful(Right(value))
        case None => ws.url("https://" + config.get[String]("auth0.domain") + "/userinfo")
          .withHttpHeaders("Authorization" -> token).get() map {
          response =>
            if (response.status >= 400) {
              Left(new Exception("Unable to get userinfo"))
            } else {
              Right((response.json \ "email").as[String])
            }
        }
      }
      _ <- email match {
        case Left(_) => Future.successful(())
        case Right(value) => cache.set(token, value, 1.hour)
      }
    } yield email


  }

  def getMeetings(page: Int, pageSize: Int, fromDate: Option[LocalDate], toDate: Option[LocalDate],
                  timeZone: Option[ZoneId]): Action[AnyContent] = authAction.async { implicit request =>


    for {
      emailOrException <- getUserEmail(request.token)
      meetings <- emailOrException match {
        case Left(_) => Future.successful(Page[MeetingListing](Nil, 0, 0, 0))
        case Right(email) => meetingDAO.getMeetingsByParticipantEmail(email, fromDate,
          toDate.map(_.plusDays(1)), timeZone, page, pageSize)
      }
    } yield {
      emailOrException match {
        case Left(_) => Unauthorized
        case Right(_) => Ok(Json.toJson(meetings))
      }
    }
  }

  def getMeeting(id: UUID): Action[AnyContent] = authAction.async { implicit request =>
    for {
      emailOrException <- getUserEmail(request.token)
      meeting <- emailOrException match {
        case Left(_) => Future.successful(None)
        case Right(email) => meetingDAO.getMeeting(id, email)
      }
    } yield {
      meeting match {
        case Some(value) => Ok(Json.toJson(value))
        case None => emailOrException match {
          case Left(_) => Unauthorized
          case Right(_) => NotFound
        }
      }
    }
  }

  def searchMeetings(query: String,
                     page: Int,
                     pageSize: Int,
                     fromDate: Option[java.time.LocalDate],
                     toDate: Option[java.time.LocalDate],
                     timeZone: Option[java.time.ZoneId]): Action[AnyContent] = authAction.async { implicit request =>
    for {
      emailOrException <- getUserEmail(request.token)
      queryResults <- emailOrException match {
        case Left(_) => Future.successful(Page[SearchResult](Nil, 0, 0, 0))
        case Right(email) => meetingDAO.searchMeetingEvents(email, query, fromDate, toDate.map(_.plusDays(1)), timeZone, page, pageSize)
      }
    } yield {
      emailOrException match {
        case Left(_) => Unauthorized
        case Right(_) => Ok(Json.toJson(queryResults))
      }
    }

  }
}
