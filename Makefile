# 项目维护命令入口。查看全部命令：make 或 make help
#
# 可覆盖的默认参数示例：
#   make admin PORT=9000
#   make download URL=https://example.com/a.jpg NAME=my_image
#   make compress NAME=img-0001.jpg SIZE=200

SHELL := /bin/bash

NODE  ?= node
PORT  ?= 8787
SIZE  ?= 400
URL   ?=
NAME  ?=

.DEFAULT_GOAL := help

.PHONY: help validate normalize normalize-dry admin download compress

help:
	@echo "项目维护命令："
	@echo ""
	@echo "  数据 / 图片"
	@echo "    make validate                         校验全部 JSON（make/validate_json.js）"
	@echo "    make normalize                        图片打平 + 统一编号 + 回填 prompts.json"
	@echo "    make normalize-dry                    同上，仅预览（--dry-run）"
	@echo "    make download URL=<链接> [NAME=名称]    下载并压缩一张图片到 images/"
	@echo "    make compress NAME=<文件名> [SIZE=KB]   压缩 images/ 下的图片（默认 $(SIZE)KB）"
	@echo ""
	@echo "  本地服务"
	@echo "    make admin [PORT=$(PORT)]               启动本地提示词管理后台"

validate:
	$(NODE) make/validate_json.js

normalize:
	$(NODE) make/normalize-images.js

normalize-dry:
	$(NODE) make/normalize-images.js --dry-run

admin:
	$(NODE) make/admin/server.js $(PORT)

download:
	@test -n "$(URL)" || { echo "用法: make download URL=<图片链接> [NAME=文件名]"; exit 1; }
	$(NODE) make/download_image.js "$(URL)" $(NAME)

compress:
	@test -n "$(NAME)" || { echo "用法: make compress NAME=<文件名> [SIZE=目标KB]"; exit 1; }
	$(NODE) make/compress_image.js "$(NAME)" $(SIZE)
