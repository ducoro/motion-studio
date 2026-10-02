"""提取参考镜头的几何表与原速音轨，背景由独立授权素材承载。"""
from pathlib import Path
import json
import subprocess
import cv2

root = Path(__file__).resolve().parent.parent
source = root / '.local/reference/reference.mp4'
cap = cv2.VideoCapture(str(source))
geometry = []
last = (947.5, 539.5, 199)
for frame in range(390):
    ok, im = cap.read()
    if not ok:
        raise RuntimeError(f'Reference stopped at frame {frame}')
    threshold = cv2.inRange(im, (230, 230, 230), (255, 255, 255))
    contours, _ = cv2.findContours(threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidates = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if 100 < w < 500 and abs(w-h) < 12 and abs(x+w/2-940) < 40 and abs(y+h/2-540) < 20:
            candidates.append((x+w/2, y+h/2, max(w, h)))
    if candidates:
        last = min(candidates, key=lambda r: abs(r[0]-last[0])+abs(r[2]-last[2]))
    cx, cy, size = last
    geometry.append({'x': cx, 'y': cy, 'size': size})
cap.release()
(root / 'assets/reference-geometry.json').write_text(json.dumps(geometry, separators=(',', ':'))+'\n')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-vn', '-c:a', 'copy', str(root / '.local/reference/reference-audio.m4a')], check=True)
print('镜头测量与参考音轨已生成')
