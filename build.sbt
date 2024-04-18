import com.typesafe.sbt.packager.docker.DockerChmodType

ThisBuild / scalaVersion := "2.13.10"

ThisBuild / version := "0.3.0-SNAPSHOT"

Docker / daemonUserUid  := None
Docker / daemonUser := "daemon"

Universal / javaOptions ++= Seq(
    "-Dpidfile.path=/dev/null"
)

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, AshScriptPlugin)
  .settings(
    name := """omoiomoi""",
    dockerExposedPorts += 9000,
    dockerBaseImage := "amazoncorretto:11-alpine-jdk",
    dockerChmodType := DockerChmodType.UserGroupWriteExecute,
    libraryDependencies ++= Seq(
      guice,
      ws,
      caffeine,
      "com.github.tminglei" %% "slick-pg" % "0.22.1",
      "org.playframework" %% "play-slick" % "6.1.0",
      "org.playframework" %% "play-slick-evolutions" % "6.1.0",
      "org.postgresql" % "postgresql" % "42.7.3",
      "com.auth0" % "jwks-rsa" % "0.20.0",
      "com.github.jwt-scala" %% "jwt-core" % "10.0.0",
      "com.github.jwt-scala" %% "jwt-play" % "10.0.0",
      "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test
    ),
    routesImport += "com.megafarad.omoiomoi.binders.CustomBinders._"
  )

