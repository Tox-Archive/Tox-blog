title: Update on the state of Tox
date: 2015-02-18 13:49:11
author: Dubslow
tags:
---

Hello everyone. We realize it's been a while since the last post, but a lot has
happened and Tox continues to progress, so there's a lot to talk about.

#Tox core

[toxcore](https://github.com/irungentoo) has been largely in maintenance mode,
with memory leaks, logic errors and other bugs being fixed every day. Recently
work has begun on implementing a [new, cleaner API](https://github.com/irungentoo/toxcore/tree/new_api)
written by the [Tox4j](https://github.com/sonOfRa/tox4j) group.

Additionally, work is progressing on the complete [groupchat re-design](https://github.com/JFreegman/toxcore)
and overhaul, started by [alnf](https://github.com/alnf) with currently being
lead primarily by [JFreegman](https://github.com/JFreegman). Features include moderation
abilities and group chat persistence (!). These group chats are currently a long
way from being ready to merge into master; however, there is currently a properly
[modified build of Toxic](https://jenkins.libtoxcore.so/job/toxic_linux_beta/lastSuccessfulBuild/artifact/toxic)
for GNU-Linux available with the changes. Note that important packet IDs have been changed
from the primary Tox network for testing purposes, so don't use that binary as your regular
client. Please also continually update it if you use it, because breaking changes
to the new groupchats are continually being made as they undergo primary
development, and old nodes on the testing network can make testing difficult for
updated nodes with newer code. You can follow development on the #tox-groupchats
IRC channel on Freenode.

#Audio filtering and echo cancellation

It's been around for a few months now, but [uTox](https://github.com/notsecure/uTox)
has had audio filtering, provided by [code](https://github.com/irungentoo/filter_audio) from [WebRTC](https://code.google.com/p/webrtc/).
([qTox](https://github.com/tux3/qTox) theoretically has had the same code, but due
to a bug, did not. That was bug was fixed yesterday.)

Recently though, [irungentoo](https://github.com/irungentoo) (project founder and
lead developer, in case you needed reminding :) ) has created [some patches for
OpenAL](https://github.com/irungentoo/openal-soft-tox)
that allow for cancelling speaker echoes from your microphone's sound input, a
necessary feature for using a microphone without headphones or earbuds. uTox
quickly put that to use, and qTox gained the same ability yesterday. Note that,
if you compile these clients yourself, you will need the patched version of OpenAL
to link against to enjoy echo cancellation. The official builds of both qTox and uTox
are both built that way, and if you need you can try using the [OpenAL builds](https://jenkins.libtoxcore.so/search/?q=openal)
on [Jenkins](https://jenkins.libtoxcore.so/) used for qTox and uTox.

Currently echo cancellation is considered experimental, and Tox is seeking testing
and feedback from users (on IRC, reddit, or wherever) about how effective it is.
If testing demonstrates that it is working properly, the patches will be submitted
to the [OpenAL upstream](https://github.com/kcat/openal-soft) for merging.

#qTox progress

Over the last several months, [krepa098](https://github.com/krepa098) had been working
on a complete re-write of qTox's chat form, and we're happy to say that it was finally
merged into master in the last week (over 4000 new lines of code!). Users should
see significant reductions in memory and CPU usage (though some problems still
exist), as well as being much prettier and easier to use. Copy and pasting in
particular had been a big issue that should be pretty much solved, and there are
some nice little animations (such as the typing notification).

Additionally, a fair bit of work (no where near as much as the new chat form required)
was put into fixing the local file encryption and its interface in qTox, and that
work was merged roughly two weeks ago. Users can now password protect their
profile to safely transfer their profile to other computers, or even public computers.
(Be sure to delete your profile when you leave a public computer!)

Finally, a lot of people probably love the new [compact contact list](http://i.imgur.com/tmX8z9s.png)
option that qTox has, thanks to [lumirayz](https://github.com/lumirayz).

A note for Mac OS X users: you may have noticed you haven't received updates in more
than a week. The problem has been resolved, but you need to download qTox manually
and reinstall in order to get the new updater (your personal data will be left intact of course).

#uTox progress

#Google Summer of Code

Like last year, Tox is applying to be a participating organization in the Google Summer of Code.
Check back soon for updates.

#Android

As mentioned above, work continues on Tox4j, and [subliun](https://github.com/subliun)
has been working on a [port of Antox to Tox4j](https://github.com/subliun/Antox).
