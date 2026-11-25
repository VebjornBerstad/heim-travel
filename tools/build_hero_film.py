#!/usr/bin/env python3
"""Build the Heim Travel hero film from the stock clips and photos in footage/pexels/.

Usage:  python3 tools/build_hero_film.py            # full build
        python3 tools/build_hero_film.py --dry-run  # print the shot list only

The film is a set of short stories. Each story is its own file, and the page plays them in a
new random order on every visit (see "Film" in script.js), always ending on the story named
"close". Per story, this writes:
  footage/build/<story>-master.mp4       graded master (not committed)
  assets/film/heim-<story>-1080.mp4      website film, 1920x1080
  assets/film/heim-<story>-720.mp4       website film for small screens, 1280x720
  assets/film/heim-<story>-poster.jpg    first frame, shown before the film loads

To change the edit, edit STORIES below. Each shot is
  (clip, start second, frames, look, zoom, vertical anchor)
The film runs at 25 fps: 7 to 10 frames is a flash, 12 about half a second, 50 a two-second hold.
A clip whose name starts with "photo-" is a still; it gets a slow push-in instead of a start time.
If you add, remove or rename a story, update the STORIES list in script.js to match.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "footage" / "pexels"
BUILD = ROOT / "footage" / "build"
OUT = ROOT / "assets" / "film"

FPS = 25

# Clip names are the file names in footage/pexels/ (Pexels ids unless prefixed); see assets/film/CREDITS.md.
FJORD_MIST, LOFOTEN, FJORD_BOAT, WATERFALL, BENCH_VIEW = "33031598", "40303327", "14415570", "33381779", "5976349"
SNOW_PEAKS, SNOW_VILLAGE, ICE_SHORE, SNOW_HOUSE, REINDEER = "10023666", "11860840", "11860863", "20654037", "31078357"
AURORA_SKY = "mixkit-4036"
WINE_POUR, PLATING, DESSERT, COUPE, BARTENDER, FIRESIDE = "8764786", "19905870", "39877520", "8967890", "4667164", "6616294"
XMAS_TOAST, XMAS_CANDLES, XMAS_TABLE = "6270528", "6274482", "6138826"
BOARDROOM, CONFERENCE = "853822", "36408715"
HIKE_SUMMIT, HIKE_RIDGE, CLIMB_PEAK, ROPED_TEAM, TRAIL = "26593932", "4763912", "39664521", "35793378", "32219347"
WHITE_RIDGE, SKIER, GLACIER, SAILBOAT, SPEEDBOAT = "32138011", "15416346", "19813338", "4936414", "4475727"
HOUSE_FLAG = "mine/IMG_7476.mov"  # our own footage, in footage/mine/
DANCE_FLOOR, DJ, CONFETTI, FIREWORKS, FIREWORK_TRAILS, BONFIRE = "10852868", "16510380", "32272235", "mixkit-4064", "18686281", "35595559"

# Looks. Several, on purpose: black and white with grain, a cold one for snow,
# a warm one for candlelight, a quiet natural one and a punchy one for fireworks and confetti.
# Party footage with people in it is always black and white.
LOOKS = {
    "bw": "hue=s=0,eq=contrast=1.18:brightness=-0.02:gamma=0.95,noise=alls=7:allf=t",
    "cool": "eq=contrast=1.06:saturation=0.7,colorbalance=bs=0.04:bm=0.02:rh=-0.01",
    "warm": "eq=contrast=1.08:saturation=0.92:gamma=0.96,colorbalance=rm=0.03:bm=-0.03:rh=0.02:bh=-0.03",
    "nat": "eq=contrast=1.05:saturation=0.88:gamma=0.98,colorbalance=rm=0.015:bm=-0.015:rh=0.01:bh=-0.02",
    # Dance floor: luma-only black and white, crushed so the crowd stays a silhouette under the lights.
    "bwsil": "hue=s=0,eq=contrast=1.6:brightness=-0.06:gamma=1.1,noise=alls=7:allf=t",
    "home": "eq=contrast=1.1:saturation=1.2:gamma=0.94,colorbalance=rm=0.015:bm=-0.015:rh=0.01:bh=-0.02",  # own phone clip
    "vivid": "eq=contrast=1.1:saturation=1.05:gamma=0.95",
    # Black and white for dark, colour-lit party footage: sums the channels so red and blue light stays bright.
    "bwparty": "colorchannelmixer=.45:.45:.45:0:.45:.45:.45:0:.45:.45:.45:0,eq=contrast=1.2:gamma=1.15,noise=alls=7:allf=t",
}

C = 0.5  # default vertical anchor: centre. 0 keeps the top of the frame, 1 the bottom.

# Every story has two halves: the place and what you do there, opening on its longest, calmest
# shot, and then the event: the table, the toast and the party, in quicker cuts. Each story
# stands on its own, because the page shuffles them. Party footage with people in it is always
# black and white.
#
# (story name, [(clip, start second, frames, look, zoom, vertical anchor), ...])
STORIES = [
    # The fjord by boat: still water, out on it, then wine, a glass raised and the party.
    ("fjord", [
        (FJORD_MIST, 2.0, 81, "bw", 1.0, C),
        (SAILBOAT, 2.0, 26, "bw", 1.0, C),
        (FJORD_BOAT, 3.0, 22, "nat", 1.0, C),
        (SPEEDBOAT, 3.0, 17, "nat", 1.0, C),
        (WATERFALL, 2.0, 14, "bw", 1.0, C),
        (WINE_POUR, 2.0, 36, "bw", 1.0, C),
        (COUPE, 2.0, 10, "warm", 1.0, C),
        (CONFETTI, 2.0, 10, "vivid", 1.3, C),
        (FIREWORK_TRAILS, 9.0, 10, "vivid", 1.0, C),
        (DJ, 2.0, 7, "bwparty", 1.0, C),
        (FIREWORKS, 20.0, 7, "vivid", 1.0, C),
    ]),

    # A summer hike: the islands, the ridge, then dinner, a toast, a bonfire and a dance.
    ("hike", [
        (LOFOTEN, 1.0, 66, "nat", 1.0, C),
        (HIKE_RIDGE, 3.0, 36, "nat", 1.0, C),
        (TRAIL, 3.0, 12, "nat", 1.0, C),
        (PLATING, 1.0, 24, "warm", 1.0, C),
        (XMAS_TOAST, 1.0, 14, "bw", 1.0, C),
        (BONFIRE, 2.0, 10, "warm", 1.0, C),
        (DJ, 5.0, 10, "bwparty", 1.0, C),
        (DANCE_FLOOR, 14.0, 10, "bwsil", 1.0, C),  # crowd as silhouette: no faces
        (FIREWORK_TRAILS, 14.0, 7, "vivid", 1.0, C),
    ]),

    # A winter summit: the peaks, the climb, then the fire, the bar and a toast.
    ("summit", [
        (SNOW_PEAKS, 15.0, 66, "bw", 1.0, C),
        (CLIMB_PEAK, 2.0, 31, "nat", 1.0, C),
        (ROPED_TEAM, 5.0, 17, "nat", 1.0, C),
        (WHITE_RIDGE, 1.0, 14, "cool", 1.0, C),
        (GLACIER, 0.3, 12, "bw", 1.0, C),  # start of the clip only: later the climber's face is close
        (FIRESIDE, 2.0, 54, "warm", 1.0, C),
        (BARTENDER, 1.0, 10, "bw", 1.25, 1.0),  # hands and apron only
        (COUPE, 12.0, 12, "warm", 1.15, C),
        (FIREWORKS, 8.0, 10, "vivid", 1.0, C),
        (XMAS_TOAST, 5.0, 7, "bw", 1.2, C),
    ]),

    # An arctic day: skiing, reindeer, the village, northern lights, then dessert and the party.
    ("arctic", [
        (SKIER, 8.0, 22, "cool", 1.0, C),
        (REINDEER, 1.0, 14, "cool", 1.0, C),
        (SNOW_VILLAGE, 2.0, 12, "cool", 1.0, C),
        (ICE_SHORE, 0.5, 10, "cool", 1.0, C),
        (SNOW_HOUSE, 3.0, 10, "cool", 1.0, C),
        (AURORA_SKY, 0.3, 54, "nat", 1.0, C),
        (DESSERT, 1.2, 19, "warm", 1.0, C),
        (DJ, 9.0, 10, "bwparty", 1.0, C),
        (FIREWORK_TRAILS, 3.0, 10, "vivid", 1.0, C),
        (CONFETTI, 5.0, 10, "vivid", 1.3, C),
    ]),

    # The close, always last: the table, the room, the biggest burst, and a wave from the terrace.
    ("close", [
        (XMAS_TABLE, 6.0, 17, "warm", 1.2, C),
        (CONFERENCE, 2.0, 12, "bw", 1.0, C),
        (CONFETTI, 7.5, 7, "vivid", 1.3, C),
        (FIREWORKS, 1.0, 7, "vivid", 1.0, C),
        (HOUSE_FLAG, 3.0, 30, "home", 1.0, 0.43),  # portrait phone clip: the terrace band
    ]),
]


def path(clip):
    # Stock clips are named by id in footage/pexels/; our own footage is "mine/<file name>" in footage/mine/.
    if clip.startswith("mine/"):
        return ROOT / "footage" / clip
    return SRC / (f"{clip}.jpg" if clip.startswith("photo-") else f"{clip}.mp4")


def stories():
    # A clip deleted from footage/ simply drops out of its story.
    missing = sorted({s[0] for _, shots in STORIES for s in shots if not path(s[0]).exists()})
    if missing:
        print("not in footage/, skipped:", ", ".join(missing), file=sys.stderr)
    return [(name, [s for s in shots if path(s[0]).exists()]) for name, shots in STORIES]


def is_photo(clip):
    return clip.startswith("photo-")


def run(cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def build(name, plan):
    inputs, chains, labels = [], [], []
    for i, (clip, start, frames, look, zoom, anchor) in enumerate(plan):
        crop = f"crop=1920:1080:(iw-1920)/2:(ih-1080)*{anchor}"
        if is_photo(clip):
            inputs += ["-loop", "1", "-framerate", FPS, "-t", f"{frames / FPS + 0.5}", "-i", path(clip)]
            # Slow push-in: work at double size so the move is smooth, then settle at 1920x1080.
            head = (
                f"[{i}:v]scale=3840:2160:force_original_aspect_ratio=increase:flags=lanczos,crop=3840:2160,"
                f"zoompan=z='1+0.002*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps={FPS}"
            )
        else:
            inputs += ["-ss", f"{start}", "-t", f"{frames / FPS + 0.5}", "-i", path(clip)]
            w, h = int(1920 * zoom / 2) * 2, int(1080 * zoom / 2) * 2
            # Phone footage is HLG in BT.2020; bring the matrix to BT.709 (the "home" look restores the colour).
            matrix = ":in_color_matrix=bt2020:out_color_matrix=bt709" if clip.startswith("mine/") else ""
            head = f"[{i}:v]fps={FPS},scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos{matrix},{crop}"
        chains.append(f"{head},setsar=1,trim=end_frame={frames},setpts=PTS-STARTPTS,format=yuv420p,{LOOKS[look]},format=yuv420p[v{i}]")
        labels.append(f"[v{i}]")
    graph = ";".join(chains) + ";" + "".join(labels) + f"concat=n={len(plan)}:v=1:a=0,format=yuv420p[out]"

    master = BUILD / f"{name}-master.mp4"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", graph, "-map", "[out]", "-an",
         "-r", FPS, "-c:v", "libx264", "-preset", "medium", "-crf", "12", master])

    # Fragmented MP4, so the page can append the stories to one another as a single stream.
    # Every story must be encoded with the same settings for that to work.
    web = ["-an", "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-preset", "slow",
           "-g", FPS * 2, "-movflags", "+frag_keyframe+empty_moov+default_base_moof+negative_cts_offsets",
           "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709"]
    run(["ffmpeg", "-v", "error", "-y", "-i", master, *web, "-crf", "24", "-maxrate", "5M", "-bufsize", "10M",
         OUT / f"heim-{name}-1080.mp4"])
    run(["ffmpeg", "-v", "error", "-y", "-i", master, "-vf", "scale=1280:720:flags=lanczos", *web,
         "-crf", "25", "-maxrate", "2500k", "-bufsize", "5M", OUT / f"heim-{name}-720.mp4"])
    run(["ffmpeg", "-v", "error", "-y", "-i", master, "-frames:v", "1", "-q:v", "3", "-update", "1",
         OUT / f"heim-{name}-poster.jpg"])


def main():
    plan = stories()
    if "--dry-run" in sys.argv:
        total = 0
        for name, shots in plan:
            at = 0
            for i, (c, t, n, look, z, a) in enumerate(shots, 1):
                print(f"{name:>7} {i:2d}  {at / FPS:5.2f}s  {c:>17}  from {t:5.1f}s  {n:2d} frames  {look:7}  zoom {z}")
                at += n
            print(f"{name:>7} is {at} frames = {at / FPS:.2f}s\n")
            total += at
        print(f"total {total} frames = {total / FPS:.2f}s in {len(plan)} stories")
        return

    BUILD.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    for name, shots in plan:
        build(name, shots)
        print("wrote", name)


if __name__ == "__main__":
    main()
