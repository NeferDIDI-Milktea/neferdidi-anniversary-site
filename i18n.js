// Arabic / English. Default = Arabic. The choice is remembered on the customer's device.
(function () {
  const A = '<span aria-hidden="true">←</span>', E = '<span aria-hidden="true">→</span>';
  const dict = {
    ar: {
      page_title: 'سنتين من الحكايات | Neferdidi',
      drinks_eyebrow: '<span></span> اكتشف نيفرديدي', drinks_h2: 'مشروبات تستاهل <em>تتجرب.</em>', drinks_p: 'ابدأ بمفضلاتنا، واكتشف باقي المنيو من خلال قنواتنا الرسمية.', menu_cta: 'اكتشف المنيو الكامل ↗',
      gallery_eyebrow: '<span></span> لحظات من مجتمعنا', gallery_h2: 'حكاياتكم <em>بتكمّل حكايتنا.</em>', gallery_p: 'المشاركات المعروضة هنا هي المشاركات التي راجعها فريق Neferdidi ووافق على نشرها.', gallery_note: 'لسه بنجمع الذكريات. شاركنا لحظتك، وبعد مراجعتها وموافقتك على النشر ممكن تظهر هنا.', gallery_cta: 'شاركنا لحظتك ↗', gallery_empty: 'أول ما نعتمد المشاركات، هتظهر هنا.',
      branches_eyebrow: '<span></span> مستنيين نشوفكم', branches_h2: 'حكايتنا مكملة <em>في فروعنا.</em>', branches_p: 'اختار الفرع الأقرب ليك وافتح موقعه على الخرائط للتأكد من الاتجاهات.', branch_map: 'افتح على الخرائط ↗',
      social_eyebrow: '<span></span> خليك قريب من الحكاية', social_h2: 'الحكاية مكملة <em>على السوشيال.</em>', social_p: 'تابعنا علشان تشوف مشروباتنا الجديدة، لحظاتكم، وكل جديد من Neferdidi.', social_follow: 'تابعنا على', social_handle_instagram: '@neferdidimilktea', social_handle_tiktok: '@neferdidimilkteashop',
      event_share_click: 'مشاركة الحملة',
      intro_h1: 'حكايتنا كبرت<br><em>بيكم</em>', intro_sub: 'كل لحظة معاكم تستاهل تفضل فاكرة.',
      intro_enter: 'ادخل الاحتفال ' + A, intro_skip: 'تخطي المقدمة',
      header_link: 'سجّل لحظتك <span aria-hidden="true">↗</span>',
      hero_eyebrow: '<span></span> الذكرى السنوية الثانية',
      hero_h2: 'سنتين من الحكايات،<br><em>ولسه البداية.</em>',
      hero_desc: 'من أول رشفة لأول ذكرى، إنتوا كنتوا جزء من حكايتنا. دلوقتي جه دوركم تحكولنا عن لحظتكم.',
      hero_cta: 'خلّي لحظتك جزء من الحكاية ' + A,
      hero_foot: '<span class="tiny-star">✦</span> صوّر صورة أو فيديو قصير وشاركنا الذكرى.',
      cap_eyebrow: '<span></span> خلّي اللحظة تعيش', cap_h2: 'مستعدين نوثّق <em>لحظتك؟</em>',
      cap_p: 'اختار كاميرا جهازك أو ارفع صورة وفيديو من المعرض. راجع مشاركتك، وبعدها ابعتهالنا في خطوة واحدة.',
      cam_ready: 'الكاميرا جاهزة لما تكون إنت جاهز', privacy: '<span>✦</span> لحظتك بأمان',
      ph_title: 'لحظتك تستاهل تتسجل', ph_sub: 'ابدأ الكاميرا أو اختار ملف من جهازك', alt_preview: 'معاينة الصورة المختارة',
      mode_video: '<span>▣</span> فيديو', mode_photo: '<span>◎</span> صورة', aria_mode: 'اختيار نوع التسجيل',
      switch_cam: 'تبديل الكاميرا', clear_media: 'إعادة', start_cam: 'تشغيل الكاميرا <span>↗</span>', upload: 'رفع من المعرض <span>↑</span>',
      file_note: 'الفيديو بحد أقصى 30 ثانية، وحجم الملف حتى 100 ميجابايت.',
      share_h3: 'خلّينا نعرفك', share_p: 'كام تفصيلة صغيرة علشان نحتفظ بذكراك صح.',
      lbl_name: 'اسمك <span>*</span>', ph_name: 'اكتب اسمك', lbl_branch: 'أنهي فرع زرت؟', opt_branch: 'اختار الفرع (اختياري)',
      opt_other: 'فرع آخر', opt_none: 'لسه مجربتش الفرع',
      lbl_note: 'احكيلنا عن اللحظة <span class="optional">اختياري</span>', ph_note: 'إيه أكتر حاجة بتحبها في Neferdidi؟',
      consent1: 'أوافق على إرسال الصورة أو الفيديو لفريق Neferdidi للاطلاع عليه والتواصل بخصوص المشاركة. <b>*</b>',
      consent2: 'أوافق بشكل اختياري على استخدام مشاركتي في محتوى Neferdidi على السوشيال ميديا أو المواد التسويقية.',
      consent_note: 'موافقتك على الإرسال لا تعني موافقتك على النشر. مش هنستخدم مشاركتك تسويقيًا إلا لو وافقت على الاختيار المنفصل.',
      submit: 'ابعت لحظتي ' + A,
      close_h2: 'الحكاية مكملة <em>بيكم.</em>', close_p: 'شكرًا إنكم كنتوا جزء من أول سنتين. مستنيين نشوف لحظاتكم.', close_btn: 'سجّل لحظتك تاني <span>↑</span>',
      peek_caption: 'سنتين معاكم', succ_h: 'وصلتنا لحظتك', succ_p: 'شكرًا إنك شاركتنا. فريق Neferdidi هيراجعها.',
      succ_again: 'ابعت لحظة تانية', share_btn: 'شارك الاحتفال مع صحابك', share_title: 'سنتين من الحكايات مع Neferdidi',
      share_text: 'احتفلنا بسنتين من Neferdidi. شاركونا لحظتكم!', copied: 'اتنسخ الرابط. ابعته لصحابك!',
      up_prep: 'بنجهّز الصورة…', up_retry: 'الاتصال ضعيف، بنحاول تاني…', up_label: 'جاري الرفع', soc_instagram: 'انستجرام', soc_tiktok: 'تيك توك', soc_facebook: 'فيسبوك', soc_whatsapp: 'واتساب',
      toggle: 'English',
      m0: 'المتصفح مش بيدعم الكاميرا هنا. افتح الموقع من رابط HTTPS أو ارفع ملف من المعرض.',
      m1: 'الكاميرا محتاجة متصفح مدعوم ورابط آمن HTTPS', m2: 'الكاميرا الأمامية شغالة', m3: 'الكاميرا الخلفية شغالة',
      m4: 'ابدأ التسجيل', m5: 'التقط الصورة', m6: 'اسمح للموقع باستخدام الكاميرا والميكروفون من إعدادات المتصفح.',
      m7: 'مش لاقيين كاميرا أو ميكروفون متاح على الجهاز.', m8: 'مش قادرين نشغّل الكاميرا. جرّب تاني أو ارفع ملف من المعرض.',
      m9: 'تعذّر تشغيل الكاميرا', m10: 'نوع الملف مش مدعوم. استخدم JPG أو PNG أو WebP أو MP4 أو WebM أو MOV.',
      m11: 'حجم الملف أكبر من 100 ميجابايت. اختار ملف أصغر.', m12: 'الصورة اتصورت وجاهزة للمراجعة', m13: 'الصورة المختارة جاهزة للمراجعة',
      m14: 'الفيديو أطول من 30 ثانية', m15: 'الفيديو لازم يكون 30 ثانية أو أقل. قصّه وجرب تاني.',
      m16: 'الفيديو اتسجل وجاهز للمراجعة', m17: 'الفيديو المختار جاهز للمراجعة', m18: 'استنى لحظة لحد ما الصورة تظهر في الكاميرا.',
      m19: 'تسجيل الفيديو مش مدعوم في المتصفح ده. استخدم رفع فيديو من المعرض.', m20: 'مش قادرين نبدأ التسجيل على الجهاز ده. جرّب رفع فيديو من المعرض.',
      m21: 'حصلت مشكلة أثناء التسجيل. جرّب تاني.', m22: 'ما اتسجلش فيديو', m23: 'إيقاف التسجيل', m24: 'بنسجل لحظتك دلوقتي…',
      m25: 'الكاميرا جاهزة لما تكون إنت جاهز', m26: 'صوّر أو اختار صورة/فيديو الأول.', m27: 'لسه ما اخترتش صورة أو فيديو.',
      m28: 'لازم توافق على إرسال المشاركة علشان نكمل.', m29: 'مفيش اتصال بالإنترنت. اتصل بالإنترنت وجرب تاني.',
      m30: '<span class="spinner" aria-hidden="true"></span> بنبعت لحظتك…', m31: 'جاري رفع الملف. سيب الصفحة مفتوحة لحد ما الرفع يكتمل.',
      m32: 'حجم الملف أكبر من المسموح. جرّب ملف أصغر.', m33: 'حصلت مشكلة أثناء الإرسال. جرّب تاني.',
      m34: 'وصلت لحظتك لفريق Neferdidi بنجاح. شكرًا إنك جزء من الحكاية!', m35: 'لحظتك وصلت بنجاح. شكرًا ليك!', m36: 'مستنيين لحظتك الجاية',
      m37: 'تعذّر الإرسال. اتأكد من الإنترنت وحاول تاني.', m38: 'تعذّر إرسال المشاركة.', m39: 'ابعت لحظتي ' + A
    },
    en: {
      page_title: 'Two Years of Stories | Neferdidi',
      drinks_eyebrow: '<span></span> Discover Neferdidi', drinks_h2: 'Drinks worth <em>trying.</em>', drinks_p: 'Start with a few favourites, then explore the full menu through our official channels.', menu_cta: 'Explore the full menu ↗',
      gallery_eyebrow: '<span></span> Moments from our community', gallery_h2: 'Your stories <em>complete ours.</em>', gallery_p: 'Only submissions reviewed and approved by the Neferdidi team appear here.', gallery_note: 'We are still collecting memories. Share your moment; after review and your publication consent, it may appear here.', gallery_cta: 'Share your moment ↗', gallery_empty: 'Approved community moments will appear here soon.',
      branches_eyebrow: '<span></span> We are waiting to see you', branches_h2: 'Our story continues <em>at our branches.</em>', branches_p: 'Choose a nearby branch and open its map search to check directions.', branch_map: 'Find on Maps ↗',
      social_eyebrow: '<span></span> STAY CLOSE TO THE STORY', social_h2: 'The story continues <em>on social.</em>', social_p: 'Follow us for new drinks, community moments, and the latest from Neferdidi.', social_follow: 'Follow us on', social_handle_instagram: '@neferdidimilktea', social_handle_tiktok: '@neferdidimilkteashop',
      event_share_click: 'Campaign share',
      intro_h1: 'Our story grew<br><em>because of you</em>', intro_sub: 'Every moment with you deserves to be remembered.',
      intro_enter: 'Enter the celebration ' + E, intro_skip: 'Skip intro',
      header_link: 'Share your moment <span aria-hidden="true">↗</span>',
      hero_eyebrow: '<span></span> Our 2nd anniversary',
      hero_h2: 'Two years of stories,<br><em>and we\'re just getting started.</em>',
      hero_desc: 'From the very first sip to this very first milestone, you have been part of our story. Now it\'s your turn to tell us about your moment.',
      hero_cta: 'Make your moment part of the story ' + E,
      hero_foot: '<span class="tiny-star">✦</span> Take a photo or a short video and share the celebration with us.',
      cap_eyebrow: '<span></span> Let the moment live on', cap_h2: 'Ready to capture <em>your moment?</em>',
      cap_p: 'Use your device camera or upload a photo or video from your gallery. Review it, then send it to us in one step.',
      cam_ready: 'Camera is ready when you are', privacy: '<span>✦</span> Your moment is safe',
      ph_title: 'Your moment deserves to be captured', ph_sub: 'Start the camera or choose a file from your device', alt_preview: 'Preview of the selected photo',
      mode_video: '<span>▣</span> Video', mode_photo: '<span>◎</span> Photo', aria_mode: 'Choose capture type',
      switch_cam: 'Switch camera', clear_media: 'Retake', start_cam: 'Start camera <span>↗</span>', upload: 'Upload from gallery <span>↑</span>',
      file_note: 'Videos up to 30 seconds, files up to 100 MB.',
      share_h3: 'Tell us about you', share_p: 'A few small details so we can keep your memory right.',
      lbl_name: 'Your name <span>*</span>', ph_name: 'Enter your name', lbl_branch: 'Which branch did you visit?', opt_branch: 'Choose a branch (optional)',
      opt_other: 'Another branch', opt_none: 'I haven\'t visited yet',
      lbl_note: 'Tell us about the moment <span class="optional">optional</span>', ph_note: 'What do you love most about Neferdidi?',
      consent1: 'I agree to send this photo or video to the Neferdidi team so they can review it and contact me about my submission. <b>*</b>',
      consent2: 'Optionally, I agree that Neferdidi may use my submission in its social media content or marketing materials.',
      consent_note: 'Agreeing to send does not mean you agree to publication. We will only use your submission for marketing if you tick the separate optional box.',
      submit: 'Send my moment ' + E,
      close_h2: 'The story goes on, <em>thanks to you.</em>', close_p: 'Thank you for being part of our first two years. We can\'t wait to see your moments.', close_btn: 'Share another moment <span>↑</span>',
      peek_caption: 'Two years together', succ_h: 'We got your moment', succ_p: 'Thanks for sharing. The Neferdidi team will review it.',
      succ_again: 'Send another moment', share_btn: 'Share the celebration', share_title: 'Two years of stories with Neferdidi',
      share_text: 'We\'re celebrating two years of Neferdidi. Share your moment!', copied: 'Link copied. Send it to your friends!',
      up_prep: 'Preparing your photo…', up_retry: 'Weak connection, trying again…', up_label: 'Uploading', soc_instagram: 'Instagram', soc_tiktok: 'TikTok', soc_facebook: 'Facebook', soc_whatsapp: 'WhatsApp',
      toggle: 'عربي',
      m0: 'Your browser doesn\'t support the camera here. Open the site over HTTPS or upload a file from your gallery.',
      m1: 'The camera needs a supported browser and a secure HTTPS link', m2: 'Front camera is on', m3: 'Rear camera is on',
      m4: 'Start recording', m5: 'Take photo', m6: 'Please allow this site to use the camera and microphone in your browser settings.',
      m7: 'No camera or microphone was found on this device.', m8: 'We couldn\'t start the camera. Try again or upload a file from your gallery.',
      m9: 'Couldn\'t start the camera', m10: 'This file type isn\'t supported. Use JPG, PNG, WebP, MP4, WebM or MOV.',
      m11: 'The file is larger than 100 MB. Please choose a smaller one.', m12: 'Photo taken and ready to review', m13: 'Selected photo is ready to review',
      m14: 'The video is longer than 30 seconds', m15: 'The video must be 30 seconds or less. Trim it and try again.',
      m16: 'Video recorded and ready to review', m17: 'Selected video is ready to review', m18: 'Wait a moment until the image shows in the camera.',
      m19: 'Video recording isn\'t supported in this browser. Upload a video from your gallery instead.', m20: 'We can\'t start recording on this device. Try uploading a video from your gallery.',
      m21: 'Something went wrong while recording. Please try again.', m22: 'No video was recorded', m23: 'Stop recording', m24: 'Recording your moment…',
      m25: 'Camera is ready when you are', m26: 'Take or choose a photo/video first.', m27: 'You haven\'t chosen a photo or video yet.',
      m28: 'Please agree to send your submission so we can continue.', m29: 'No internet connection. Please reconnect and try again.',
      m30: '<span class="spinner" aria-hidden="true"></span> Sending your moment…', m31: 'Uploading your file. Please keep this page open until it\'s done.',
      m32: 'The file is too large. Please try a smaller one.', m33: 'Something went wrong while sending. Please try again.',
      m34: 'Your moment reached the Neferdidi team. Thank you for being part of the story!', m35: 'Your moment was sent. Thank you!', m36: 'Waiting for your next moment',
      m37: 'Couldn\'t send. Check your internet connection and try again.', m38: 'Couldn\'t send your submission.', m39: 'Send my moment ' + E
    }
  };
  let lang = 'ar';
  try { const saved = localStorage.getItem('nd_lang'); if (saved === 'en' || saved === 'ar') lang = saved; } catch (e) {}
  const t = (key) => (dict[lang] && dict[lang][key]) || dict.ar[key] || key;
  function apply() {
    const root = document.documentElement; root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('page_title');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(';').forEach((pair) => { const [attr, key] = pair.split(':'); if (attr && key) el.setAttribute(attr.trim(), t(key.trim())); });
    });
    document.querySelectorAll('.lang-toggle').forEach((b) => { b.textContent = t('toggle'); b.setAttribute('lang', lang === 'ar' ? 'en' : 'ar'); });
    window.dispatchEvent(new Event('langchange'));
  }
  window.t = t; window.getLang = () => lang;
  window.setLang = (l) => { lang = l === 'en' ? 'en' : 'ar'; try { localStorage.setItem('nd_lang', lang); } catch (e) {} apply(); };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-toggle').forEach((b) => b.addEventListener('click', () => window.setLang(lang === 'ar' ? 'en' : 'ar')));
    apply();
  });
})();
