/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/*
 * Copyright © 2023 Levente Farkas
 * Copyright © 2015 Mike Chaberski
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
 * Author: Mike Chaberski <mike10004@users.noreply.github.com>
 * Author: Levente Farkas <lfarkas@lfarkas.org>
 */

/*
 * Simple extension to add a logout button to the panel.
 */

import Gio from 'gi://Gio';
import St from 'gi://St';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as GnomeSession from 'resource:///org/gnome/shell/misc/gnomeSession.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const LOGOUT_MODE_NORMAL = 0;

var baseGIcon;
var hoverGIcon;
var buttonIcon;

export default class LogoutButtonExtension extends Extension {
  logoutButton = null;

  enable() {
    this.logoutButton = new St.Bin({
      style_class: 'panel-button',
      reactive: true,
      can_focus: true,
      x_expand: true,
      y_expand: false,
      track_hover: true
    });
    var dir = this.path;
    // credit: http://stackoverflow.com/questions/20394840/how-to-set-a-png-file-in-a-gnome-shell-extension-for-st-icon
    baseGIcon = Gio.icon_new_for_string(dir + "/icons/logout-base.svg");
    hoverGIcon = Gio.icon_new_for_string(dir + "/icons/logout-hover.svg");
    buttonIcon = new St.Icon({
      'gicon': Gio.icon_new_for_string(dir + "/icons/logout-base.svg"),
      'style_class': 'system-status-icon'
    });

    this.logoutButton.set_child(buttonIcon);
    this.logoutButton.connect('button-press-event', _DoLogout);
    this.logoutButton.connect('enter-event', function () {
      _SetButtonIcon('hover');
    });
    this.logoutButton.connect('leave-event', function () {
      _SetButtonIcon('base');
    });

    Main.panel._rightBox.insert_child_at_index(this.logoutButton, 0);
  }

  disable() {
    Main.panel._rightBox.remove_child(this.logoutButton);
    this.logoutButton = null;
  }
}

function _SetButtonIcon(mode) {
  if (mode === 'hover') {
    buttonIcon.set_gicon(hoverGIcon);
  } else {
    buttonIcon.set_gicon(baseGIcon);
  }
}

function _DoLogout() {
  var sessionManager = new GnomeSession.SessionManager();
  sessionManager.LogoutRemote(LOGOUT_MODE_NORMAL);
}
