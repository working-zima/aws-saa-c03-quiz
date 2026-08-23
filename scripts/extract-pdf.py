#!/usr/bin/env python3
"""
원본 PDF에서 개념 텍스트를 추출해 docs/source/concepts-raw.md 로 저장한다.

문제 은행 생성과 '개념 학습' 모드의 원본 데이터를 만드는 일회성 도구다.
결과물(concepts-raw.md)은 커밋되므로, 앱 빌드에는 이 스크립트가 필요 없다.

Usage:
    pip install PyPDF2==3.0.1
    python3 scripts/extract-pdf.py

추출 품질 문제:
    이 PDF는 자간(letter-spacing)이 벌어진 제목을 쓴다. 텍스트 레이어에서는
    글자마다 공백이 하나씩, 단어 사이에는 공백이 둘 이상 들어간다.
        "E l a s t i c  C o m p u t e"  ->  "Elastic Compute"
    따라서 자간 복구를 먼저 하고, 그 다음에 다중 공백을 접어야 한다.
    순서를 뒤집으면 단어 경계가 사라져 "ElasticCompute"가 된다.
"""

import glob
import re
import sys
from pathlib import Path

try:
    import PyPDF2
except ImportError:
    sys.exit("PyPDF2가 필요하다: pip install PyPDF2==3.0.1")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "source" / "concepts-raw.md"

# PDF 커닝 때문에 단어 중간에 공백이 박힌 고유명사들. 자간 복구로는 못 고친다.
# (토큰이 두 글자 이상이라 한 글자 런 패턴에 안 걸린다)
#
# 목록 갱신 방법: 추출 후 아래로 남은 조각을 훑고, 새로 보이는 것만 추가한다.
#   grep -oE "[A-Za-z]{1,4} [a-z]{1,4}" docs/source/concepts-raw.md | sort | uniq -c | sort -rn
BROKEN_TERMS = {
    # 서비스명
    "A WS": "AWS",
    "NA T": "NAT",
    "NA CL": "NACL",
    "W AF": "WAF",
    "A CM": "ACM",
    "MF A": "MFA",
    "T CP": "TCP",
    "R out e": "Route",
    "CloudF r ont": "CloudFront",
    "CloudW at ch": "CloudWatch",
    "CloudT r ail": "CloudTrail",
    "Pr iv at eLink": "PrivateLink",
    "Identit y Cent er": "Identity Center",
    "Identit y": "Identity",
    "Mar iaDB": "MariaDB",
    "M ySQL": "MySQL",
    "P ost gr eSQL": "PostgreSQL",
    "Aur or a": "Aurora",
    "Dynamo DB": "DynamoDB",
    "Elasi tCache": "ElastiCache",
    "ElasitCache": "ElastiCache",
    "K inesis": "Kinesis",
    "Kinesi s": "Kinesis",
    "A thena": "Athena",
    "Sp ar k": "Spark",
    "R edShif t": "Redshift",
    "RedShif t": "Redshift",
    "Redshif t": "Redshift",
    "Sno wb all": "Snowball",
    "Snowb all": "Snowball",
    "Guar dDut y": "GuardDuty",
    "Cognit o": "Cognito",
    "F ar gat e": "Fargate",
    "Ev entBr idge": "EventBridge",
    "Ev ent Br idge": "EventBridge",
    "Lustr e": "Lustre",
    "ONT AP": "ONTAP",
    "Fir ehose": "Firehose",
    "Accelerat or": "Accelerator",
    "Secr et s": "Secrets",
    "Secret s": "Secrets",
    "Par amet er St ore": "Parameter Store",
    "T rust ed A d visor": "Trusted Advisor",
    "A d visor": "Advisor",
    "Ad visor": "Advisor",
    "Budget s": "Budgets",
    "Explor er": "Explorer",
    "Conf ig": "Config",
    "T ransf er": "Transfer",
    "Tr ansf er": "Transfer",
    "Gat ew a y": "Gateway",
    "Gat ew ay": "Gateway",
    "Gat eway": "Gateway",
    "Gat e wa y": "Gateway",
    "St or age": "Storage",
    "Dat aSync": "DataSync",
    "Micr osof t Entra ID": "Microsoft Entra ID",
    "W or ksp ace": "Workspace",
    "na v er": "naver",
    "y outube": "youtube",
    # 일반 용어
    "Syst em": "System",
    "Net w or k": "Network",
    "Ser vice": "Service",
    "Ser v er": "Server",
    "Securit y": "Security",
    "Secur it y": "Security",
    "A v ailabilit y": "Availability",
    "Av ailabilit y": "Availability",
    "Mul ti- AZ": "Multi-AZ",
    "Single- AZ": "Single-AZ",
    "Mul ti": "Multi",
    "Cont ent Deliv er y Net w or k": "Content Delivery Network",
    "Sa vings Plan": "Savings Plan",
    "Comput e": "Compute",
    "Inst ance": "Instance",
    "Inst ant": "Instant",
    "Clust er": "Cluster",
    "Configur ation": "Configuration",
    "Conf igur ation": "Configuration",
    "Managem ent": "Management",
    "P er mission Set": "Permission Set",
    "Pr o vier": "Provider",
    "Pr o vider": "Provider",
    "A ccess K e y": "Access Key",
    "Access K e y": "Access Key",
    "A ccess": "Access",
    "Infr equent": "Infrequent",
    "Lo ad Balancer": "Load Balancer",
    "T ok en": "Token",
    "Glacier Deep A r chiv e": "Glacier Deep Archive",
    "A r chiv e": "Archive",
    "Ar chiv e": "Archive",
    "Int elligent": "Intelligent",
    "T iering": "Tiering",
    "Tier ing": "Tiering",
    "Lif ecy cle": "Lifecycle",
    "V ersioning": "Versioning",
    "Encr yption": "Encryption",
    "Repl ication": "Replication",
    "Direc t": "Direct",
    "Dir ect": "Direct",
    "T ransit Gat ew ay": "Transit Gateway",
    "St andar d": "Standard",
    "St andb y": "Standby",
    "R etr ie v al": "Retrieval",
    "Fle xible": "Flexible",
    "R esol v er": "Resolver",
    "R eplic a": "Replica",
    "Re ad": "Read",
    "Cr oss": "Cross",
    "R egion": "Region",
    "Glob al": "Global",
    "Buck et": "Bucket",
    "Disast er": "Disaster",
    "R eco v er y": "Recovery",
    "Pr o xy": "Proxy",
    "Aut o Sc aling": "Auto Scaling",
    "Str e ams": "Streams",
    "Gr oup": "Group",
    "Gr een": "Green",
    "Deplo yment": "Deployment",
    "R ot ation": "Rotation",
    "Or igin": "Origin",
    "Oper ations": "Operations",
    "Bat ch": "Batch",
    "Allo w": "Allow",
    "Windo ws": "Windows",
    "F amil y": "Family",
    "P er Second": "Per Second",
    "FSx f or": "FSx for",
    "t ape": "tape",
    "St orage": "Storage",
    "Dat ab ase": "Database",
    "Dat a": "Data",
    "Aur or 의": "Aurora의",
    "Aur ora": "Aurora",
    "Amaz on": "Amazon",
    "A cceler at or": "Accelerator",
    "D AX": "DAX",
    "CloudT rail": "CloudTrail",
    "T rust ed": "Trusted",
    "T ar get": "Target",
    "T racking": "Tracking",
    "P olic y": "Policy",
    "P ar amet er": "Parameter",
    "P eer ing": "Peering",
    "Pr iv at e": "Private",
    "Pr iv acy": "Privacy",
    "Ap ache": "Apache",
    "Service f or": "Service for",
    "Lat enc y": "Latency",
    "R outing": "Routing",
    "Exactl y": "Exactly",
    "-b ased": "-based",
    "Sit e": "Site",
    "Migr ation": "Migration",
    "Applic ation": "Application",
    "Geoloc ation": "Geolocation",
    "In v alidation": "Invalidation",
    "Tr ansit": "Transit",
    "T ransit": "Transit",
    "St or e": "Store",
    "Paramet er": "Parameter",
    "Answ er": "Answer",
    "Multi-v alue": "Multi-value",
    "P er f or mance": "Performance",
    "Ex tract": "Extract",
    "T ar nsf or m": "Transform",
    "Lo ad": "Load",
    "Mac hine Le ar ning": "Machine Learning",
    "Geopr o ximit y": "Geoproximity",
    "W eight ed": "Weighted",
    "At hena": "Athena",
    "Contr ol": "Control",
    "O TP": "OTP",
    "X SS": "XSS",
    "por t": "port",
    "Den y": "Deny",
    "R ole": "Role",
    # 원문 오탈자 교정 — 문맥상 "주 DB"(대기 DB의 반대)이므로 Primary.
    "Pr iv ar y": "Primary",
    "Paramaet er": "Parameter",
    # 한글도 같은 커닝 아티팩트를 겪는다.
    "존 재": "존재",
}

# 자간이 벌어진 런: 한 글자 영숫자가 '단일' 공백으로 이어진 구간.
# 단어 사이의 이중 공백은 건드리지 않으므로 경계가 보존된다.
SPACED_RUN = re.compile(r"(?<![A-Za-z0-9])(?:[A-Za-z0-9] )+[A-Za-z0-9](?![A-Za-z0-9])")


def clean(text: str) -> str:
    if not text:
        return ""

    text = text.replace(" ", " ").replace("​", "")

    # 1. 자간 복구 — 반드시 다중 공백 접기보다 먼저.
    text = SPACED_RUN.sub(lambda m: m.group(0).replace(" ", ""), text)

    # 2. 다중 공백 접기.
    text = re.sub(r"[ \t]{2,}", " ", text)

    # 2-1. 자간 때문에 벌어진 하이픈 복구 ("Sit e - to - Sit e" -> "Site-to-Site").
    #      하이픈이 자간 런을 끊어서 1번에서 살아남는다. ASCII 사이의 " - "만 대상.
    text = re.sub(r"(?<=[A-Za-z0-9]) ?- ?(?=[A-Za-z])", "-", text)

    # 3. 커닝으로 깨진 고유명사 복구. 긴 것부터 적용해야 부분 치환에 안 먹힌다.
    #    두 번 도는 이유: 치환이 새 매치를 만든다.
    #    "Ser vice f or" -> (Ser vice) -> "Service f or" -> (Service f or) -> "Service for"
    #    1패스만 돌면 긴 키가 먼저 검사되는 시점에 아직 그 문자열이 없어서 놓친다.
    for _ in range(2):
        for broken in sorted(BROKEN_TERMS, key=len, reverse=True):
            text = text.replace(broken, BROKEN_TERMS[broken])

    # 4. 구두점 주변 공백 정리.
    text = re.sub(r"\s+([,.)\]%])", r"\1", text)
    text = re.sub(r"([(\[])\s+", r"\1", text)

    text = re.sub(r"\n{3,}", "\n\n", text)
    return "\n".join(line.rstrip() for line in text.split("\n")).strip()


def main() -> None:
    pdfs = sorted(glob.glob(str(ROOT / "*.pdf")))
    if not pdfs:
        sys.exit(f"PDF를 찾을 수 없다: {ROOT}/*.pdf")
    src = Path(pdfs[0])

    reader = PyPDF2.PdfReader(str(src))
    parts = [
        "# AWS SAA-C03 개념 원문 (PDF 추출)",
        "",
        f"> 원본: `{src.name}` — {len(reader.pages)}페이지",
        "> `scripts/extract-pdf.py`로 기계 추출 후 자간·고유명사 보정. 원문 표현을 유지한다.",
        ">",
        "> **남아 있는 추출 아티팩트** — 이 파일을 인용할 때 걸러낼 것:",
        "> - 페이지 하단의 반복 머리말과 쪽번호.",
        "> - 여는 괄호가 유실된 구간 (`DNSDomain Name System)` = `DNS(Domain Name System)`).",
        ">   닫는 괄호만 남아서 여는 위치를 기계적으로 복원할 수 없다. 의미로 판단할 것.",
    ]
    for i, page in enumerate(reader.pages, start=1):
        parts.append(f"\n<!-- ===== PAGE {i} ===== -->\n")
        parts.append(clean(page.extract_text()))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} — {len(reader.pages)}페이지, {OUT.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
