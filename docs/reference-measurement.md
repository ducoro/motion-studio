# Optional reference measurement

The camera geometry is already included at `assets/reference-geometry.json`. Previewing and rendering use that data directly.

To repeat the original measurement study, supply your own copy of the [reference film](https://x.com/nbaschez/status/2105815862460723434) at `.local/reference/reference.mp4`, then run:

```sh
python3 -m venv .local/venv
.local/venv/bin/python -m pip install -r scripts/requirements.txt
.local/venv/bin/python scripts/prepare-reference.py
bun run checksums
```

The script measures 390 frames of dock position and size and writes `assets/reference-geometry.json`. It also extracts the reference soundtrack into `.local/reference/reference-audio.m4a` for local comparison. The distributed film uses the independent Bach recording in `assets/music/`.

The `.local/` directory is ignored by Git. The public source includes the measurement script and derived geometry; the original reference video and soundtrack remain local study material.
