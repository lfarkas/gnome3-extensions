EXTENSIONS = lockscreen@lfarkas.org logoutbutton@lfarkas.org

all: $(EXTENSIONS:%=%.zip)

%.zip:
	cd $* && zip -r ../$@ .

clean:
	rm -f $(EXTENSIONS:%=%.zip)

install: all
	mkdir -p $(HOME)/.local/share/gnome-shell/extensions
	for ext in $(EXTENSIONS); do \
	    unzip -o $$ext.zip -d $(HOME)/.local/share/gnome-shell/extensions/$$ext; \
	done
