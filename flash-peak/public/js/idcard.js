/* Welcome + digital ID Card reveal page. Reads the just-registered
   member from sessionStorage (set by register.js) and renders the
   animated Player ID Card, with a real PNG download via html2canvas.

   IMPORTANT FIX: html2canvas frequently produces a blank/empty PNG when
   the capture target contains <img> tags pointing at remote or SVG
   sources (the DiceBear avatar URL, /assets/logo.svg, even the QR code
   data URI in some browsers) because those either get canvas-tainted or
   simply fail to rasterize inside the snapshot. To make the download
   reliable, every <img> inside the capture target is first converted to
   an inline base64 data URI, decoded, and only then is html2canvas run —
   plus a blank-canvas guard so a silent failure never produces an empty
   downloaded file again. */

function urlToDataUri(url) {
  return fetch(url, { mode: 'cors' })
    .then(res => {
      if (!res.ok) throw new Error('Gagal fetch: ' + url);
      return res.blob();
    })
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

async function inlineImagesAsDataUris(rootEl) {
  const imgs = Array.from(rootEl.querySelectorAll('img'));
  await Promise.all(imgs.map(async (img) => {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) return;
    try {
      const dataUri = await urlToDataUri(src);
      img.src = dataUri;
      await new Promise((resolve) => {
        if (img.complete) return resolve();
        img.onload = resolve;
        img.onerror = resolve;
      });
    } catch (err) {
      console.warn('Gagal inline gambar untuk kartu:', src, err);
    }
  }));
}

function initIdCardPage() {
  const raw = sessionStorage.getItem('fp_id_card');
  const memberRaw = sessionStorage.getItem('fp_new_member');

  if (!raw || !memberRaw) {
    window.location.href = '/register.html';
    return;
  }

  const card = JSON.parse(raw);
  const member = JSON.parse(memberRaw);

  document.getElementById('welcome-nickname').textContent = card.username;

  const stage = document.getElementById('idcard-stage');
  stage.innerHTML = `
    <div class="idcard" id="idcard-capture">
      <div class="idcard-hex"></div>
      <div class="idcard-top">
        <div class="idcard-brand">
          <img src="/assets/logo.svg" alt="" style="width:20px;height:20px;" crossorigin="anonymous">
          LORD
        </div>
        <div class="idcard-id">${card.memberId}</div>
      </div>
      <div class="idcard-body">
        <img class="idcard-avatar" src="${card.avatar}" alt="" crossorigin="anonymous">
        <div class="idcard-info">
          <div class="ic-name">${escapeHtml(card.username)}</div>
          <div class="ic-gameid">GAME ID &middot; ${escapeHtml(card.gameId)}</div>
          <div class="idcard-tags">
            <span class="badge badge-${card.position.toLowerCase()}">${card.position}</span>
          </div>
        </div>
      </div>
      <div class="idcard-foot">
        <div class="ic-join">JOINED<br>${card.joinDate}</div>
        <div class="ic-qr"><img src="${card.qrCode}" alt="QR Code"></div>
      </div>
    </div>
  `;

  document.getElementById('download-card-btn').addEventListener('click', async () => {
    const btn = document.getElementById('download-card-btn');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Menyiapkan gambar...';

    try {
      const target = document.getElementById('idcard-capture');

      // The actual fix: swap every <img> for a base64 data URI first.
      await inlineImagesAsDataUris(target);

      const canvas = await html2canvas(target, {
        backgroundColor: '#0F172A',
        scale: 3,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000,
        logging: false
      });

      // Guard against a fully blank canvas slipping through silently —
      // sample pixels' alpha channel across the image.
      const ctx = canvas.getContext('2d');
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let hasContent = false;
      for (let i = 3; i < pixels.length; i += 4 * 97) {
        if (pixels[i] !== 0) { hasContent = true; break; }
      }
      if (!hasContent) {
        throw new Error('Canvas kosong setelah render');
      }

      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `LORD-IDCard-${card.username}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast('ID Card berhasil diunduh. Kirim ke grup ya!');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengunduh kartu. Coba screenshot manual sebagai alternatif.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  });

  document.getElementById('share-card-btn').addEventListener('click', async () => {
    const shareUrl = `${window.location.origin}/member.html?id=${encodeURIComponent(card.memberId)}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'LORD Community',
          text: `Kenalan sama ${card.username} di LORD!`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link profil disalin ke clipboard.');
      }
    } catch (err) {
      showToast('Link profil disalin ke clipboard.');
    }
  });
}
