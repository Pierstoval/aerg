
_INFO := "\033[32m[INFO]\033[0m %s\n"
_NOTE := "\033[33m[NOTE]\033[0m %s\n"
_WARN := "\033[33m[WARNING]\033[0m %s\n"
_ERROR := "\033[31m[ERROR]\033[0m %s\n"

##
## Project setup
## =============
##

YARN_OPTIONS ?= --flat --ignore-engines --ignore-platform

.DEFAULT_GOAL := help
help: ## Show this help message
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-25s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help

install: ## Install the project
	yarn install $(YARN_OPTIONS)
.PHONY: install

upgrade: ## Update project's dependencies (alias: update)
	yarn upgrade --latest $(YARN_OPTIONS)
.PHONY: upgrade

update: upgrade
.PHONY: update

start: ## Start the project
	yarn dev
.PHONY: start

##
