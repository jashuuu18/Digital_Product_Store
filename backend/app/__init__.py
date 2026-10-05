from app.database import SessionLocal
from app.models import User

db = SessionLocal()

user = db.query(User).filter(
    User.email == "jashu@gmail.com"
).first()

if user:
    user.role = "admin"
    db.commit()
    print("User is now admin")
    print("Email:", user.email)
    print("Role:", user.role)
else:
    print("User not found")

db.close()