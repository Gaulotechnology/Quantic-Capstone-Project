import os
import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()
    
    orig = content
    
    # 1. Fix slotProps.primary/secondary nesting
    # slotProps={{ primary: { fontSize: '...', fontWeight: ... } }}
    # -> slotProps={{ primary: { sx: { fontSize: '...', fontWeight: ... } } }}
    content = re.sub(
        r'slotProps={{ (primary|secondary): { ([^}]+) } }}',
        r'slotProps={{ \1: { sx: { \2 } } }}',
        content
    )
    
    # 2. Move alignItems, justifyContent from props to sx on Grid and Stack
    def move_to_sx(match):
        tag = match.group(1)
        props = match.group(2)
        
        # Props to move
        to_move = ['alignItems', 'justifyContent', 'textAlign', 'fontWeight', 'fontSize', 'noWrap']
        moved = {}
        
        for prop in to_move:
            p_match = re.search(f'{prop}={{?["\']?([^"\'}}]+)["\']?}}?', props)
            if p_match:
                moved[prop] = p_match.group(1)
                # Remove from props
                props = re.sub(rf'\s*{prop}={{?["\']?([^"\'}}]+)["\']?}}?', '', props)
        
        if moved:
            # Add to sx or create sx
            sx_match = re.search(r'sx={{ ([^}]+) }}', props)
            sx_items = []
            for k, v in moved.items():
                if k == 'noWrap':
                    sx_items.append('whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"')
                else:
                    sx_items.append(f'{k}: "{v}"' if isinstance(v, str) and not v.isdigit() else f'{k}: {v}')
            
            if sx_match:
                new_sx = sx_match.group(1) + ', ' + ', '.join(sx_items)
                props = re.sub(r'sx={{ [^}]+ }}', f'sx={{{{ {new_sx} }}}}', props)
            else:
                props += f' sx={{{{ {", ".join(sx_items)} }}}}'
        
        return f'<{tag}{props}>'

    content = re.sub(r'<(Grid|Stack|Typography|Box)([^>]+)>', move_to_sx, content)
    
    # 3. Fix length checks
    content = content.replace('cv.extracted_data.skills.length', 'cv.extracted_data?.skills?.length || 0')
    content = content.replace('cv.extracted_data.work_experiences.length', 'cv.extracted_data?.work_experiences?.length || 0')
    
    # 4. Remove unused imports
    content = content.replace('Stepper,', '')
    content = content.replace('Step,', '')
    content = content.replace('StepLabel,', '')
    
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
