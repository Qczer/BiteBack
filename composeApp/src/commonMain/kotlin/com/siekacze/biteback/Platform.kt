package com.siekacze.biteback

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform