#!/usr/bin/env bash

COMMAND=$1

if [[ $COMMAND == "enable" ]]; then
	echo "Setting registry to local registry"
	echo "To Disable: pnpm local-registry disable"
	npm config set registry http://localhost:4873/
	pnpm config set registry http://localhost:4873/
fi

if [[ $COMMAND == "disable" ]]; then
	npm config delete registry
	pnpm config delete registry
	CURRENT_NPM_REGISTRY=$(npm config get registry)
	CURRENT_PNPM_REGISTRY=$(pnpm config get registry)

	echo "Reverting registries"
	echo "  > NPM:  $CURRENT_NPM_REGISTRY"
	echo "  > PNPM: $CURRENT_PNPM_REIGSTRY"
fi

if [[ $COMMAND == "clear" ]]; then
	echo "Clearing Local Registry"
	rm -rf ./build/local-registry/storage
fi

if [[ $COMMAND == "start" ]]; then
	echo "Starting Local Registry"
	VERDACCIO_HANDLE_KILL_SIGNALS=true
	pnpm verdaccio --config ./.verdaccio/config.yml
fi
