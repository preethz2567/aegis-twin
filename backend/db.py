import os
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

DB_PATH = os.path.join(DATA_DIR, "aegis_twin.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    network_profile_name = Column(String, default="default")
    attack_path_json = Column(Text)
    fix_recommendations_json = Column(Text)
    explanation_text = Column(Text)
    original_risk_score = Column(Float)
    projected_risk_score = Column(Float)

class NetworkProfile(Base):
    __tablename__ = "network_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    topology_json = Column(Text)
    node_count = Column(Integer)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Seed default network profile if empty
    db = SessionLocal()
    try:
        if db.query(NetworkProfile).count() == 0:
            default_net_path = os.path.join(DATA_DIR, "network.json")
            if os.path.exists(default_net_path):
                with open(default_net_path, 'r') as f:
                    topology_data = json.load(f)
                    node_count = len(topology_data.get('nodes', []))
                    
                    default_profile = NetworkProfile(
                        name="Default Demo Network",
                        description="Initial seed network topology.",
                        topology_json=json.dumps(topology_data),
                        node_count=node_count,
                        is_active=True
                    )
                    db.add(default_profile)
                    db.commit()
    finally:
        db.close()

def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
