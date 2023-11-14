/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/*
 * Copyright © 2023 Levente Farkas
 * Copyright © 2014 Sriram Ramkrishna
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the licence, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Sriram Ramkrishna <sri@ramkrishna.me>
 * Author: Levente Farkas <lfarkas@lfarkas.org>
 */

/*
 * Simple extension to lock the screen from an icon on the panel.
 */

import Clutter from 'gi://Clutter';
import St from 'gi://St';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
/*import * as ScreenSaver from 'resource:///org/gnome/shell/misc/screenSaver.js';*/
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class LockScreenButtonExtension extends Extension {
	lockScreenButton = null;

	enable() {
		this.lockScreenButton = new St.Bin({
			style_class: 'panel-button',
			reactive: true,
			can_focus: true,
			y_align: Clutter.ActorAlign.CENTER,
			track_hover: true
		});
		let icon = new St.Icon({
			icon_name: 'changes-prevent-symbolic',
			style_class: 'system-status-icon'
		});
		this.lockScreenButton.set_child(icon);
		this.lockScreenButton.connect('button-press-event', _LockScreenActivate);

		Main.panel._rightBox.insert_child_at_index(this.lockScreenButton, 0);
	}

	disable() {
		Main.panel._rightBox.remove_actor(this.lockScreenButton);
		this.lockScreenButton = null;
	}

}

function _LockScreenActivate() {
	Main.overview.hide();
	/*	screenSaverProxy = new ScreenSaver.ScreenSaverProxy();
		screenSaverProxy.LockRemote();*/
	Main.screenShield.lock(true)
}

// This function is called once when the extension is loaded, not enabled.
function init() {
	return new Extension();
}
