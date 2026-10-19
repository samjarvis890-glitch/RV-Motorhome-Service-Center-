import shutil
import os
from PIL import Image

print("--- Preparing updated image assets ---")

# 1. Services Hero: assets/images/services/services-hero.jpg
# Copy from assets/images/home/service-detail.jpg (1200x896, certified technician Ben in Bay 4 with tablet)
shutil.copy2('assets/images/home/service-detail.jpg', 'assets/images/services/services-hero.jpg')
print("Updated assets/images/services/services-hero.jpg")

# 2. Contact Intro: assets/images/contact/contact-intro.jpg
# Copy from assets/images/services/service-request.jpg (1200x896, luxury service reception bay with advisor and King Aire coach)
shutil.copy2('assets/images/services/service-request.jpg', 'assets/images/contact/contact-intro.jpg')
print("Updated assets/images/contact/contact-intro.jpg")

# 3. Services Section 5 (Scheduling Intake): assets/images/services/service-scheduling.jpg
# 1000x750 Thor Chateau luxury coach
with Image.open('scratch/super_c.jpg') as img:
    w, h = img.size
    target_ratio = 4 / 3
    crop_w = int(h * target_ratio)
    left = (w - crop_w) // 2
    cropped = img.crop((left, 0, left + crop_w, h)).resize((1000, 750), Image.Resampling.LANCZOS)
    cropped.save('assets/images/services/service-scheduling.jpg', quality=92)
print("Created assets/images/services/service-scheduling.jpg")

# 4. Home Card 3 (Utilities: Electrical & Plumbing): assets/images/home/service-utilities.jpg
# Victron Energy pure-sine inverter/charger 48V/10000W
with Image.open('scratch/victron.jpg') as img:
    w, h = img.size
    target_ratio = 800 / 500
    crop_h = int(w / target_ratio)
    top = int(h * 0.15)
    cropped = img.crop((0, top, w, top + crop_h)).resize((800, 500), Image.Resampling.LANCZOS)
    cropped.save('assets/images/home/service-utilities.jpg', quality=92)
print("Created assets/images/home/service-utilities.jpg")

# 5. Contact Section 3: assets/images/contact/contact-service-detail.jpg
# Camper utility connection / shore line inspection
with Image.open('scratch/camper_repair.jpg') as img:
    w, h = img.size
    target_ratio = 480 / 300
    crop_h = int(w / target_ratio)
    top = int((h - crop_h) * 0.3)
    cropped = img.crop((0, top, w, top + crop_h)).resize((960, 600), Image.Resampling.LANCZOS)
    cropped.save('assets/images/contact/contact-service-detail.jpg', quality=92)
print("Updated assets/images/contact/contact-service-detail.jpg")

# 6. Contact Section 5: assets/images/contact/contact-preparation.jpg
# Camper interior kitchen & living space ready for departure
with Image.open('scratch/camper_interior.jpg') as img:
    w, h = img.size
    target_ratio = 640 / 500
    crop_w = int(h * target_ratio)
    left = (w - crop_w) // 2
    cropped = img.crop((left, 0, left + crop_w, h)).resize((1000, 781), Image.Resampling.LANCZOS)
    cropped.save('assets/images/contact/contact-preparation.jpg', quality=92)
print("Updated assets/images/contact/contact-preparation.jpg")

# 7. Services Tabs: tab-electrical, tab-interior, tab-winterization
shutil.copy2('assets/images/home/service-utilities.jpg', 'assets/images/services/tab-electrical.jpg')
shutil.copy2('assets/images/contact/contact-preparation.jpg', 'assets/images/services/tab-interior.jpg')

print("--- All image updates complete ---")
