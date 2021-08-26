APPS = packages/*
CYPRESS = e2e-tests/*

down:
	docker-compose down
.PHONY: down

install:
	npm ci

	for dir in ${CYPRESS}; do \
		echo "-- Installing $${dir} --"; \
		(cd $${dir} && npm ci); \
		echo "-- Installed for $${dir} --"; \
  	done

	for dir in ${APPS}; do \
		echo "-- Installing $${dir} --"; \
		(cd $${dir} && npm ci); \
		echo "-- Installed for $${dir} --"; \
  	done
.PHONY: install

serve:
	docker-compose up
.PHONY: serve
