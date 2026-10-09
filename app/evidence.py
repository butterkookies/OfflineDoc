import re
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict

@dataclass
class EvidenceSpan:
    field: str
    quote: str
    status: str # "verified" or "unverified"
    start_char: Optional[int] = None
    end_char: Optional[int] = None

def normalize_text(text: str) -> str:
    """Normalizes whitespace and lowercases for fuzzy match."""
    return re.sub(r"\s+", " ", text.lower().strip())

def verify_evidence_spans(transcript: str, evidence_map: Dict[str, Optional[str]]) -> Dict[str, Dict[str, Any]]:
    """
    Verifies that evidence quotes exist within the transcript.
    Locates start_char and end_char character spans for two-way UI highlighting.
    """
    verified_results = {}

    for field, quote in evidence_map.items():
        if not quote or not isinstance(quote, str) or not quote.strip():
            continue

        quote_clean = quote.strip()
        # 1. Exact case-sensitive match
        pos = transcript.find(quote_clean)
        if pos != -1:
            verified_results[field] = asdict(EvidenceSpan(
                field=field,
                quote=quote_clean,
                status="verified",
                start_char=pos,
                end_char=pos + len(quote_clean),
            ))
            continue

        # 2. Case-insensitive match
        match = re.search(re.escape(quote_clean), transcript, re.IGNORECASE)
        if match:
            verified_results[field] = asdict(EvidenceSpan(
                field=field,
                quote=quote_clean,
                status="verified",
                start_char=match.start(),
                end_char=match.end(),
            ))
            continue

        # 3. Fuzzy normalized match (ignoring punctuation differences)
        norm_transcript = normalize_text(transcript)
        norm_quote = normalize_text(quote_clean)

        norm_pos = norm_transcript.find(norm_quote)
        if norm_pos != -1:
            # Estimate positions in original transcript
            # Token search
            tokens = norm_quote.split()
            if tokens:
                first_tok = re.escape(tokens[0])
                last_tok = re.escape(tokens[-1])
                span_pattern = rf"{first_tok}[\s\S]*?{last_tok}"
                fuzzy_match = re.search(span_pattern, transcript, re.IGNORECASE)
                if fuzzy_match:
                    verified_results[field] = asdict(EvidenceSpan(
                        field=field,
                        quote=quote_clean,
                        status="verified",
                        start_char=fuzzy_match.start(),
                        end_char=fuzzy_match.end(),
                    ))
                    continue

        # Unverified quote (hallucinated or drifted)
        verified_results[field] = asdict(EvidenceSpan(
            field=field,
            quote=quote_clean,
            status="unverified",
            start_char=None,
            end_char=None,
        ))

    return verified_results
