# Alter server — PowerShell setup (no IntelliJ)

Scripts to install, run and update [AlterRSPS/Alter](https://github.com/AlterRSPS/Alter)
— an RSMod-derived OSRS server, revision 228 — entirely from Windows PowerShell.

Upstream's README requires IntelliJ. That isn't because the project needs an IDE;
it's because `gradlew` and `gradlew.bat` are listed in Alter's `.gitignore`, so a
fresh clone ships the Gradle wrapper JAR with no launcher script to run it.
IntelliJ papers over this with its own bundled Gradle. These scripts call the
wrapper's entry point directly instead, which is all `gradlew.bat` does anyway.

## Quick start

```powershell
cd alter-server
.\Setup-Alter.ps1 -InstallJava     # one time, 10-20 minutes
.\Start-Alter.ps1                  # every time after that
```

If PowerShell refuses to run the scripts, either use the `.cmd` launchers
(`Setup-Alter.cmd`, `Start-Alter.cmd`), which set the policy per-process, or
unblock them once:

```powershell
Get-ChildItem .\alter-server\*.ps1 | Unblock-File
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## What you get

| Script | Purpose |
| --- | --- |
| `Setup-Alter.ps1` | One-time install: JDK, clone, cache, XTEA keys, build, RSA keys, client config. |
| `Start-Alter.ps1` | Boots the server. Equivalent to IntelliJ's "Run Server". |
| `Update-Alter.ps1` | `git pull` plus a recompile. Never touches the cache. `-NoPull`, `-Clean`, `-SkipTests`. |
| `AlterCommon.ps1` | Shared helpers. Dot-sourced by the others; not run directly. |

By default Alter is cloned to `..\Alter` relative to this folder, i.e. the repo
root. Pass `-AlterPath D:\somewhere\Alter` to any script to use another location.

## Requirements

- **Windows PowerShell 5.1** (built in) or PowerShell 7+.
- **Git** — `winget install Git.Git`.
- **JDK 17** — `winget install EclipseAdoptium.Temurin.17.JDK`, or let
  `Setup-Alter.ps1 -InstallJava` do it.
- **~10 GB free disk** and a reasonable connection. The cache download alone is
  several hundred MB, and the first Gradle run pulls Gradle 8.11 plus every
  dependency.
- **[RSProx](https://github.com/blurite/rsprox/releases)** for the client.

The scripts look for a JDK in `ALTER_JAVA_HOME`, `JAVA_HOME`, the usual Program
Files vendor directories, `%USERPROFILE%\.jdks` (where IntelliJ puts them) and
`PATH`. Java 17 is preferred; 18–23 is accepted, in which case Gradle downloads a
17 toolchain for compilation via the foojay resolver already configured in
`settings.gradle.kts`.

## What `Setup-Alter.ps1` actually does

1. Resolves a JDK, installing Temurin 17 via winget if `-InstallJava` is passed.
2. `git clone https://github.com/AlterRSPS/Alter.git` into the target path.
3. Downloads the revision 228 cache (`disk.zip`) and XTEA keys (`keys.json`) from
   `archive.openrs2.org`, then places `main_file_cache.*` into `data\cache\` and
   the keys at `data\xteas.json`. It locates the cache files by searching the
   extracted archive for `main_file_cache.dat2`, so a change in the archive's
   folder layout won't break it.
4. Runs the Gradle `game-server:install` task, which builds everything, generates
   the RSA keypair into `data\rsa\key.pem`, decrypts the world map, and copies
   `game.example.yml` → `game.yml` and `dev-settings.example.yml` →
   `dev-settings.yml`.
5. Reads the RSA modulus out of the generated `modulus` file and writes
   `%USERPROFILE%\.rsprox\proxy-targets.yaml` so RSProx can connect. If that file
   already exists it is left alone and the block is printed for you to merge.

Skip step 3 with `-SkipDownload` if you already have a cache — for example one
you're carrying over from your 2011scape work — placed at `data\cache\`.

## Important: `install` is a one-way door

`game-server:install` is not idempotent. Look at what it does in
`game-server/build.gradle.kts` and `mapDecrypter.kt`: it decrypts the world map
into the cache using `data\xteas.json`, then renames that file to
`xteas.json.backup` and writes an empty `[]` in its place.

Run it a second time and it decrypts an already-decrypted cache against an empty
key set, which corrupts the cache. IntelliJ will happily let you double-click the
task again; `Setup-Alter.ps1` will not — it detects `game.yml` or
`data\xteas.json.backup` and refuses.

So:

- **Routine updates and recompiles → `Update-Alter.ps1`.** It runs `build`, never
  `install`.
- **Genuinely starting over →** delete `data\cache\`, `data\xteas.json` and
  `data\xteas.json.backup`, then run `Setup-Alter.ps1 -Force`.

## Running the server

```powershell
.\Start-Alter.ps1                       # normal boot
.\Start-Alter.ps1 -LogLevel info        # verbose Gradle output
.\Start-Alter.ps1 -Port 43595           # override the port check
.\Start-Alter.ps1 -AlterPath D:\Alter   # non-default location
```

Source changes are picked up on every boot — the Gradle `run` task compiles
`game-server` and everything on its runtime classpath, `game-plugins` included,
before launching. There's no separate build step to remember.

Before starting it verifies the cache is complete, `game.yml` exists, and
`data\rsa\key.pem` exists. That last check matters: if the RSA key is missing,
`RsaService` blocks on a `Scanner(System.in)` prompt at startup, which looks like
a hung server rather than an error.

It also warns if the game port is already bound, which is the usual cause of a
second instance dying on startup.

The server runs in the foreground under `--no-daemon`, so Ctrl+C shuts it down
cleanly instead of leaving a 4 GB Gradle daemon holding the port.

A healthy boot ends with a line reporting the world initialised. If all you see
is `Alter Loaded up in x ms.` with nothing after it, something in the cache or
config is wrong.

## Configuration

Both files live in the Alter checkout root and are gitignored, so your edits
survive `Update-Alter.ps1`:

- `game.yml` — server name, `game-port` (default 43594), `revision`, home
  coordinates, staff privilege levels, and the list of services to start.
- `dev-settings.yml` — debug toggles for examines, objects, buttons, items,
  spells and packets.

`Start-Alter.ps1` reads `game-port` out of `game.yml` for its port check, so
changing the port there is enough.

## Client setup

Use [RSProx](https://github.com/blurite/rsprox/releases). Setup writes the target
config for you; the modulus it contains comes from the `modulus` file in the
Alter root and is unique to your keypair. If you regenerate the RSA key you must
update the client config too, or logins will fail.

To print the modulus again later:

```powershell
Select-String -Path ..\Alter\modulus -Pattern '^modulus:'
```

## Troubleshooting

**The first build takes forever.** Expected. It downloads Gradle 8.11 and the
full dependency tree from Maven Central, JitPack, `repo.openrs2.org` and
OpenRune's own repo. Later builds are incremental.

**Corporate network or VPN blocks the downloads.** `archive.openrs2.org` and
JitPack are the usual casualties. Fetch the cache manually, drop the files into
`data\cache\`, and run with `-SkipDownload`.

**`No suitable JDK found`.** Install Temurin 17, or point at an existing JDK:

```powershell
$env:ALTER_JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot"
```

**A Gradle daemon is stuck holding memory or the port.**

```powershell
cd ..\Alter
& "$env:JAVA_HOME\bin\java.exe" -classpath .\gradle\wrapper\gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain --stop
```

**You want a raw Gradle task.** Same pattern — that one line is the portable
replacement for `gradlew.bat`, and any task name works after it.

**Build fails after an upstream pull.** Try `.\Update-Alter.ps1 -NoPull -Clean`.

## Notes for plugin development

Game content lives in `game-plugins/`; engine code is in `game-server/` and
`game-api/`. Editing either and re-running `.\Start-Alter.ps1` is enough; Gradle
recompiles as part of starting. Reach for `.\Update-Alter.ps1 -NoPull -Clean`
only when stale build output is the suspect.

`Launcher.kt` resolves its paths relative to the `game-server` directory
(`../data`, `../game.yml`), which is why the server must be launched through the
Gradle `run` task rather than a bare `java -jar`. The scripts do that for you; if
you build your own launcher, set the working directory to `<Alter>\game-server`.
