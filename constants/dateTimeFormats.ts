export const dateTimeFormats = [
    {
        "pattern": "yyyyMMddHHmmss",
        "description": "ISO Date-Time without spaces",
        "example": "20250809151145"
    },
    {
        "pattern": "YYYYMMDDHHMMSS",
        "description": "ISO Date-Time",
        "example": "2025-08-0915:11:45"
    },
    {
        "pattern": "yyyy-MM-dd HH:mm:ss",
        "description": "Date and time with space",
        "example": "2025-08-09 15:11:45"
    },
    {
        "pattern": "HH:mm",
        "description": "Hours:Minutes (24-hour)",
        "example": "15:11"
    },
    {
        "pattern": "hh:mm a",
        "description": "Hours:Minutes AM/PM",
        "example": "03:11 PM"
    },
    {
        "pattern": "HH:mm:ss",
        "description": "Hours:Minutes:Seconds",
        "example": "15:11:45"
    },
    {
        "pattern": "hh:mm:ss a",
        "description": "Hours:Minutes:Seconds AM/PM",
        "example": "03:11:45 PM"
    },
    {
        "pattern": "yyyy-MM-dd'T'HH:mm:ss.SSS",
        "description": "ISO with milliseconds",
        "example": "2025-08-09T15:11:45.123"
    },
    {
        "pattern": "yyyy-MM-dd'T'HH:mm:ssXXX",
        "description": "ISO with timezone offset",
        "example": "2025-08-09T15:11:45+05:00"
    },
    {
        "pattern": "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
        "description": "ISO with ms + timezone",
        "example": "2025-08-09T15:11:45.123+05:00"
    }
]