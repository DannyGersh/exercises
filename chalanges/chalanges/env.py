from dotenv import load_dotenv
from os import getenv
from pathlib import Path

dotenv_path = Path('../../.env')
load_dotenv()

ENV_PSQL = getenv('ENV_PSQL')