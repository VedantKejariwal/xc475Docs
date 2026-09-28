# Project ABUJA — Problem-Phase User Interviews

Three interviews, transcribed and written up against the Problem-Phase USER Interview Template.

| File | Contents |
|---|---|
| `TRANSCRIPT-Abir-Bajaj.md` | Verbatim transcript, both Abir recordings |
| `TRANSCRIPT-Daksh-and-Adhiraj.md` | Verbatim transcript, Dexter Park recording |
| `TEMPLATE-Abir-Bajaj.md` | Filled interview template |
| `TEMPLATE-Daksh-Datt-Mishra.md` | Filled interview template |
| `TEMPLATE-Adhiraj-Singh-Sidhu.md` | Filled interview template |

## How the transcripts were produced

There is no speech-to-text service reachable from this environment, so the pipeline was
built locally: **PyAV** decodes the `.m4a` files to 16 kHz mono PCM, and **OpenAI Whisper
`small` (multilingual, ONNX/quantized)** runs under transformers.js in `translate` mode, so
Hindi passages come out in English. Audio is cut into ~25–30s windows at the quietest point
in each 22–30s search band, so no speech is lost at a boundary.

## Read this before quoting anything

**Whisper `small` is a mid-size model.** Larger, more accurate models (`medium`, `large-v3`)
are hosted only on services this environment cannot reach. The model is reliable on clear
English and noticeably weaker on code-switched Hinglish and on proper nouns. The Dexter Park
recording (clear English) transcribed well; Abir's two recordings (fast Hinglish, overlapping
speech) contain real errors.

**No speaker diarization.** Timestamps mark audio windows, not speaker turns, so several
speakers frequently appear inside one block. The Daksh/Adhiraj split at 29:42 is inferred
from content, not from voice identification.

### Known and suspected mis-transcriptions

| Transcript says | Almost certainly | Where |
|---|---|---|
| "Com App", "option area" | **Comm Ave** | Abir 1 |
| "Brooklyn" | **Brookline** | throughout |
| "Austin" | **Allston** | Abir 1, Abir 2 |
| "BO" | **BU** | Dexter Park |
| "Quest Room building" | **Questrom** | Dexter Park |
| "tea", "T-VSA" | **the T / MBTA** | throughout |
| "miles", "Maria", "Marita" | **Myles** (Myles Standish Hall) | Dexter Park |
| "December of 1994" | **December 2024** | Dexter Park 00:22 |
| "January or 20 years" | **January 2025** | Dexter Park 00:47 |
| "Zelo" | **Zillow** | Abir 2 |
| "landlots" | **landlords** | Abir 1 |
| "$50,000 innovation" | **$50,000 renovation** | Abir 1 |
| "Plano and Texas" | **Plano, Texas** | Dexter Park |
| "2014 … Boston Marathon bombings" | **2013** | Dexter Park 27:40 |
| "AMI categories" | **Area Median Income** | Abir 2 |
| "sublasing" | **subleasing** | Dexter Park |
| "a bid", "Abeer", "base on" | **Abir** | Dexter Park |
| "SMI background" | **ethnic background** | Dexter Park |
| "SM Mantri one" | a course code (**SM 131**?) | Dexter Park 19:38 |
| "professor Bhaat Vazgarkesh" | professor's name — **unrecovered** | Abir 1 00:49 |
| "Manupadeva Repair" | a data source — **unrecovered** | Abir 1 04:13 |
| "11 Eushen Street" | an address — **unrecovered** | Abir 1 04:13 |
| "Spark" | **BU Spark!** (Faculty of Computing & Data Sciences) | Abir 1, Dexter Park |

Names of the three interviewees were supplied by Ved, not recovered from audio.

## One process note worth carrying into the next round

The ABUJA interview guide says to ask Questions 1–7 **before** introducing the solution, to
avoid leading the participant. The two conversations went differently:

- **Daksh** — the guide was followed. Questions 1–7 ran from 00:00 to ~16:00, and the
  dashboard was only described at 16:17. His priorities are therefore unprompted and his
  ranking is usable evidence.
- **Abir** — the solution was described at ~2:32 of the first recording, before any
  problem-discovery questions. The conversation became a feasibility and business critique
  rather than problem discovery, so it yields good advisory input but weak evidence about
  the problem itself.

This is reflected in the two write-ups.
