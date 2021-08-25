APPS = packages/*

down:
	docker-compose down
.PHONY: down

install:
	npm ci

	for dir in ${APPS}; do \
		echo "-- Installing $${dir} --"; \
		(cd $${dir} && npm ci); \
		echo "-- Installed for $${dir} --"; \
  	done
.PHONY: install

serve:
	docker-compose up
.PHONY: serve
