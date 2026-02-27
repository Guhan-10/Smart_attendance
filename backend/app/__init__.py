<<<<<<< HEAD
# Ensure the app directory is in the Python path
import os
import sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)


=======

# Ensure the app directory is in the Python path

import os
import sys
sys.path.append('c:/Users/tobim/Music/projects/smart_attendance/backend')


# Check and create __init__.py files if missing

# Ensure __init__.py exists
init_file = 'c:/Users/tobim/Music/projects/smart_attendance/backend/app/__init__.py'
if not os.path.exists(init_file):
    with open(init_file, 'w'):
        pass
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
