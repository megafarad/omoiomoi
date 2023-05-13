package com.megafarad.omoiomoi.model

case class Page[T](items: Seq[T], page: Int, offset: Int, total: Long) {
  lazy val prev: Option[Int] = Option(page - 1).filter(_ >= 0)
  lazy val next: Option[Int] = Option(page + 1).filter(_ => (offset + items.size) < total)
}
