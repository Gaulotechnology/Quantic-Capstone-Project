import os
import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()
    
    orig = content
    
    # 1. Fix dispatch(fetchJobs()) -> dispatch(fetchJobs({}))
    content = content.replace('dispatch(fetchJobs())', 'dispatch(fetchJobs({}))')
    
    # 2. Fix optional chaining in CandidateDashboard
    content = content.replace('cv.extracted_data.skills.length', 'cv.extracted_data?.skills?.length || 0')
    content = content.replace('cv.extracted_data.work_experiences.length', 'cv.extracted_data?.work_experiences?.length || 0')
    
    # 3. Fix Chip icon=null error in CVManagement
    # In MUI v9, icon cannot be null if it's supposed to be an element
    content = content.replace('icon={undefined}', '')
    content = content.replace('icon={null}', '')

    # 4. Remove unused imports
    content = re.sub(r'import {[^}]+} from \'@mui/icons-material\';', lambda m: m.group(0).replace('PlayIcon', '').replace('Work', ''), content)
    
    if content != orig:
        with open(path, 'w') as f:
            f.write(content)
        return True
    return False

src_dir = 'frontend/src'
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            if fix_file(path):
                print(f"Fixed {path}")
