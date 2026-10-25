import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import * as ResEdit from 'resedit'

/**
 * Stamp the app icon onto the Windows exe (pure-JS replacement for rcedit,
 * which needs wine on Linux). Runs in afterPack so the stamped exe is what
 * gets packaged into the NSIS installer and portable builds.
 */
function stampExeIcon(exePath, icoPath, meta) {
  const exe = ResEdit.NtExecutable.from(readFileSync(exePath))
  const res = ResEdit.NtExecutableResource.from(exe)
  const iconFile = ResEdit.Data.IconFile.from(readFileSync(icoPath))
  const groups = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries)
  if (!groups.length) throw new Error(`no icon group found in ${exePath}`)
  for (const g of groups) {
    ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
      res.entries,
      g.id,
      g.lang,
      iconFile.icons.map((item) => item.data)
    )
  }
  // version info (what rcedit --set-version-string does)
  const viList = ResEdit.Resource.VersionInfo.fromEntries(res.entries)
  if (viList.length && meta) {
    const vi = viList[0]
    const [major, minor, patch] = meta.version.split('.').map(Number)
    vi.setFileVersion(major, minor || 0, patch || 0, 0, 1033)
    vi.setProductVersion(major, minor || 0, patch || 0, 0, 1033)
    vi.setStringValues(
      { lang: 1033, codepage: 1200 },
      {
        FileDescription: meta.productName,
        ProductName: meta.productName,
        CompanyName: meta.company,
        LegalCopyright: meta.copyright,
        OriginalFilename: meta.exeName,
        InternalName: meta.productName,
      }
    )
    vi.outputToResourceEntries(res.entries)
  }
  res.outputResource(exe)
  const tmp = `${exePath}.stamped`
  writeFileSync(tmp, Buffer.from(exe.generate()))
  renameSync(tmp, exePath)
}

export default async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return

  const prebuildFolder = context.arch === 3 ? 'win32-arm64' : 'win32-x64'

  const result = spawnSync(process.execPath, ['scripts/prune-selection-hook-win.js', context.appOutDir, prebuildFolder], {
    stdio: 'inherit',
    cwd: process.cwd()
  })

  if (result.status !== 0) {
    throw new Error(`afterPack prune script failed with status ${result.status ?? 'unknown'}`)
  }

  const exeName = `${context.packager.appInfo.productName}.exe`
  const exePath = join(context.appOutDir, exeName)
  const appInfo = context.packager.appInfo
  stampExeIcon(exePath, join(process.cwd(), 'build', 'icon-win.ico'), {
    productName: appInfo.productName,
    version: appInfo.version,
    company: 'SelectAI',
    copyright: 'Copyright © 2026 SelectAI',
    exeName,
  })
  console.log(`[after-pack] stamped app icon onto ${exePath}`)
}
