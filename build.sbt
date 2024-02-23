import com.typesafe.sbt.packager.docker.DockerChmodType

ThisBuild / scalaVersion := "2.13.10"

ThisBuild / version := "0.2.0-SNAPSHOT"

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
      "com.typesafe.play" %% "play-slick" % "5.2.0",
      "com.typesafe.play" %% "play-slick-evolutions" % "5.2.0",
      "org.postgresql" % "postgresql" % "42.5.4",
      "com.auth0" % "jwks-rsa" % "0.20.0",
      "com.github.jwt-scala" %% "jwt-core" % "9.2.0",
      "com.github.jwt-scala" %% "jwt-play" % "9.2.0",
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
    ),
    routesImport += "com.megafarad.omoiomoi.binders.CustomBinders._"
  )

