from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json
import os
from dotenv import load_dotenv
from sqlalchemy.dialects.mysql import LONGTEXT

# Load environment variables from .env
load_dotenv()

# Get MySQL credentials (you can add these in your .env file)
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_DB = os.getenv("MYSQL_DB", "quiz_db")

# SQLAlchemy connection URL for MySQL
DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"

# Create the database engine
engine = create_engine(DATABASE_URL)

# Session for database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


# Quiz Model
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    title = Column(String(255), nullable=False)
    date_generated = Column(DateTime, default=datetime.utcnow)
    scraped_content = Column(Text, nullable=True)  # optional: full article content
    from sqlalchemy.dialects.mysql import LONGTEXT
    raw_html = Column(LONGTEXT, nullable=True)
    full_quiz_data = Column(Text, nullable=False)  # store the JSON output of quiz



# Create all tables (if they don't exist)
def init_db():
    Base.metadata.create_all(bind=engine)
