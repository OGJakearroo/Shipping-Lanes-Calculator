#!/bin/sh
# Cloudflare Pages build script
# Injects the short commit SHA into BUILD_DATE for deployed builds
if [ -n "$CF_PAGES_COMMIT_SHA" ]; then
  SHORT_SHA=$(echo "$CF_PAGES_COMMIT_SHA" | cut -c1-7)
  sed -i "s/const BUILD_DATE   = '[^']*';/const BUILD_DATE   = '${SHORT_SHA}';/" js/state.js
  echo "Build: injected commit SHA ${SHORT_SHA} into js/state.js"
fi
