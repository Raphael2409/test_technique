
OUTDIR=www
TEMPLATE_OUTDIR=$(OUTDIR)/app/templates

CSS= node_modules/angular-material/angular-material.css \
	node_modules/material-design-icons/iconfont/material-icons.css \
	node_modules/golden-layout/src/css/goldenlayout-base.css \
	node_modules/golden-layout/src/css/goldenlayout-dark-theme.css \
	node_modules/jstree/dist/themes/default-dark/style.min.css \
	node_modules/font-awesome/css/font-awesome.css \
	node_modules/angular-material-data-table/dist/md-data-table.min.css \
	node_modules/bootstrap/dist/css/bootstrap.min.css \
	node_modules/d3-context-menu/css/d3-context-menu.css \
	node_modules/spectrum-colorpicker/spectrum.css \
	app/css/app.css

CSSOUT= $(OUTDIR)/css/css.compile.css

all: build 

create_outdir:
	@mkdir -p $(TEMPLATE_OUTDIR)
	@mkdir -p $(OUTDIR)/js
	@mkdir -p $(OUTDIR)/css
	@mkdir -p $(OUTDIR)/fonts

link: create_outdir
	cp index.html assets www/ -r
	cp app/templates/* $(TEMPLATE_OUTDIR) -r

build: create_outdir
	@node bin/build.js

watch :
	@node bin/watch.js

css: create_outdir
	cat $(CSS) | csso -o $(CSSOUT) --map file
	cp node_modules/jstree/dist/themes/default-dark/32px.png node_modules/jstree/dist/themes/default-dark/40px.png node_modules/jstree/dist/themes/default-dark/throbber.gif $(OUTDIR)/css
	cp node_modules/font-awesome/fonts/* $(OUTDIR)/fonts -r

init: css link build

run:
	@true

clean:
	rm -rf www node_modules nerve-center .browser_organs .apps.json .config.json launch.config.js

.PHONY: all init run build link css create_outdir watch
