#!/bin/bash
# Bring the shared art and commentary directories into the repository, so that a commit carries what the
# other threads have written (the art with its sources and notes; the commentary records, debates,
# citations and pathways). Run it before committing; it changes nothing when the shared directories are absent.
set -e
cd "$(dirname "$0")/.."
for d in art commentary; do
  if [ -d "/mnt/project-files/$d" ]; then
    rm -rf "$d.tmp"
    cp -a "/mnt/project-files/$d" "$d.tmp"
    find "$d.tmp" \( -name __pycache__ -o -name node_modules \) -type d -prune -exec rm -rf {} +
    find "$d.tmp" -name '*.log' -delete
    rm -rf "$d"
    mv "$d.tmp" "$d"
  else
    echo "no /mnt/project-files/$d; $d/ left as it is"
  fi
done
git status --short art commentary | wc -l | sed 's/$/ files changed under art\/ and commentary\//'
