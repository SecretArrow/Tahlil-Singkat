/**
 * Tahlil Singkat — content data.
 *
 * Each section is one recitation in a short (ringkas) tahlil majelis, with
 * three layers: Arabic original, Latin transliteration, and Indonesian
 * translation. The <ArabicText/> component renders the ۝X ayah-end marks as
 * an ornamental circle with the digit overlaid (Mushaf style).
 *
 * Sources are cited per section. Quranic text uses the standard Uthmani
 * orthography (with ۝ followed by Arabic-Indic digits ٠-٩ as ayah markers).
 * Non-Quranic zikir/doa are labelled as "amaliah tahlilan" (commonly recited
 * in Indonesian tahlil gatherings) where a single canonical hadith source is
 * not the only one in use.
 */

export type TahlilSection = {
  /** Stable slug, used as React key and anchor id for in-page navigation. */
  id: string;
  /** 1-based ordinal shown in the section badge. */
  number: number;
  /** Indonesian title. */
  title: string;
  /** Short Indonesian description shown under the title. */
  description: string;
  /** Arabic text. May contain ۝X ayah-end marks. */
  arabic: string;
  /** Latin transliteration of the Arabic. Optional (zikir may omit). */
  transliteration?: string;
  /** Indonesian translation / meaning. */
  translation: string;
  /** How many times to recite. Optional (default once). */
  repeat?: number;
  /** Human-readable source citation. */
  source: string;
};

export const tahlilSections: TahlilSection[] = [
  {
    id: "al-fatihah",
    number: 1,
    title: "Al-Fātihah",
    description:
      "Surah pembuka Al-Qur'an. Dibaca satu kali sebagai pembuka majelis, dengan niat pahala ditujukan kepada Nabi Muhammad ﷺ, para ulama, keluarga, dan kaum muslimin yang telah wafat.",
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝١ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝٢ الرَّحْمَٰنِ الرَّحِيمِ ۝٣ مَالِكِ يَوْمِ الدِّينِ ۝٤ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝٦ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝٧",
    transliteration:
      "Bismillāhir-raḥmānir-raḥīm. Al-ḥamdu lillāhi rabbi l-ʿālamīn. Ar-raḥmānir-raḥīm. Māliki yaumi d-dīn. Iyyāka naʿbudu wa-iyyāka nastaʿīn. Ihdinaṣ-ṣirāṭal-mustaqīm. Ṣirāṭal-lażīna anʿamta ʿalaihim, gairil-magḍūbi ʿalaihim wa laḍ-ḍāllīn.",
    translation:
      "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam. Yang Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan. Tunjukilah kami jalan yang lurus. (Yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.",
    source: "QS. Al-Fātihah: 1–7",
  },
  {
    id: "tahlil",
    number: 2,
    title: "Tahlil",
    description:
      "Inti dari majelis tahlil: mengucapkan kalimat tauhid. Lazim dibaca berulang (100 kali) bersama-sama dengan suara pelan maupun lantang.",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "Lā ilāha illallāh",
    translation: "Tiada tuhan (yang berhak disembah) selain Allah.",
    repeat: 100,
    source: "Zikir inti tahlilan — amaliah ulama Nusantara",
  },
  {
    id: "shalawat",
    number: 3,
    title: "Ṣalawat Ibrāhīmiyyah",
    description:
      "Ṣalawat kepada Nabi Muhammad ﷺ, sebagaimana yang dibaca dalam tasyahhud. Pahala tahlil disampaikan melalui perantaraan ṣalawat ini.",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā ṣallaita ʿalā Ibrāhīm wa ʿalā āli Ibrāhīm, innaka ḥamīdun majīd. Allāhumma bārik ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīm wa ʿalā āli Ibrāhīm, innaka ḥamīdun majīd.",
    translation:
      "Ya Allah, berilah rahmat kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau telah memberi rahmat kepada Nabi Ibrahim dan keluarganya. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berilah keberkahan kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau telah memberi keberkahan kepada Nabi Ibrahim dan keluarganya. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
    source: "Doa ṣalawat dalam tasyahhud — HR. Bukhārī & Muslim",
  },
  {
    id: "al-ikhlas",
    number: 4,
    title: "Surah Al-Ikhlāṣ",
    description:
      "Pernyataan tauhid yang ringkas namun setara sepertiga Al-Qur'an. Dibaca tiga kali, pahalanya ikut disampaikan kepada arwah.",
    arabic:
      "قُلْ هُوَ اللَّهُ أَحَدٌ ۝١ اللَّهُ الصَّمَدُ ۝٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝٣ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۝٤",
    transliteration:
      "Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul-lahū kufuwan aḥad.",
    translation:
      "Katakanlah: Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu pun yang setara dengan Dia.",
    repeat: 3,
    source: "QS. Al-Ikhlāṣ: 1–4",
  },
  {
    id: "al-falaq",
    number: 5,
    title: "Surah Al-Falaq",
    description:
      "Memohon perlindungan kepada Allah dari segala kejahatan makhluk. Dibaca tiga kali sebagai penjagaan.",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝١ مِن شَرِّ مَا خَلَقَ ۝٢ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝٣ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝٤ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ۝٥",
    transliteration:
      "Qul aʿūżu birabbil-falaq. Min syarri mā khalaq. Wa min syarri ghāsiqin iżā waqab. Wa min syarrin-naffāṡāti fil-ʿuqad. Wa min syarri ḥāsidin iżā ḥasad.",
    translation:
      "Katakanlah: aku berlindung kepada Tuhan yang menguasai subuh (fajar), dari kejahatan makhluk-Nya; dan dari kejahatan malam apabila telah gelap gulita; dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya); dan dari kejahatan orang yang dengki apabila ia mendengki.",
    repeat: 3,
    source: "QS. Al-Falaq: 1–5",
  },
  {
    id: "an-nas",
    number: 6,
    title: "Surah An-Nās",
    description:
      "Memohon perlindungan kepada Allah dari gangguan setan dan bisikan waswas. Dibaca tiga kali sebagai penutup perlindungan.",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝١ مَلِكِ النَّاسِ ۝٢ إِلَهِ النَّاسِ ۝٣ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝٤ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝٥ مِنَ الْجِنَّةِ وَالنَّاسِ ۝٦",
    transliteration:
      "Qul aʿūżu birabbin-nās. Malikin-nās. Ilāhin-nās. Min syarril-waswāsil-khannās. Allażī yuwaswisu fī ṣudūrin-nās. Minal-jinnati wan-nās.",
    translation:
      "Katakanlah: aku berlindung kepada Tuhan manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) setan yang bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia.",
    repeat: 3,
    source: "QS. An-Nās: 1–6",
  },
  {
    id: "ayat-kursi",
    number: 7,
    title: "Āyatul-Kursī",
    description:
      "Ayat paling agung dalam Al-Qur'an, mengandung sifat-sifat keagungan Allah. Dibaca satu kali sebagai peneguh tauhid dan penjagaan.",
    arabic:
      "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration:
      "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm. Lā taʾkhużuhū sinatuw wa lā nawm. Lahū mā fis-samāwāti wa mā fil-arḍ. Man żal-lażī yasyfaʿu ʿindahū illā bi-iżnih. Yaʿlamu mā baina aidīhim wa mā khalfahum. Wa lā yuḥīṭūna bisyaiʾim min ʿilmihī illā bimā syāʾ. Wasiʿa kursiyyuhus-samāwāti wal-arḍ. Wa lā yaʾūduhū ḥifẓuhumā wa huwal-ʿaliyyul-ʿaẓīm.",
    translation:
      "Allah, tidak ada tuhan (yang berhak disembah) melainkan Dia, Yang Maha Hidup lagi terus-menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi. Siapakah yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan dan di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun dari ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Maha Tinggi lagi Maha Besar.",
    source: "QS. Al-Baqarah: 255",
  },
  {
    id: "tasbih-tahmid",
    number: 8,
    title: "Tasbīḥ, Taḥmid & Takbīr",
    description:
      "Zikir penghapus dosa yang dibaca selepas setiap salat fardu maupun dalam majelis zikir. Mengandung empat kalimat penuh keberkahan.",
    arabic:
      "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration:
      "Subḥānallāh, wal-ḥamdulillāh, wa lā ilāha illallāh, wallāhu akbar, wa lā ḥaula wa lā quwwata illā billāhil-ʿaliyyil-ʿaẓīm.",
    translation:
      "Maha Suci Allah, segala puji bagi Allah, tiada tuhan selain Allah, Allah Maha Besar, dan tiada daya upaya serta kekuatan melainkan dengan pertolongan Allah Yang Maha Tinggi lagi Maha Besar.",
    repeat: 33,
    source: "Zikir penuh keberkahan — lafaz zikir harian",
  },
  {
    id: "doa-arwah",
    number: 9,
    title: "Doa untuk Arwah",
    description:
      "Memohonkan ampunan dan rahmat bagi diri sendiri serta seluruh saudara muslimin yang telah mendahului kita dalam keimanan — termasuk arwah yang didoakan.",
    arabic:
      "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ",
    transliteration:
      "Rabbanaghfir lanā wa li-ikhwāninallażīna sabaqūnā bil-īmān, wa lā tajʿal fī qulūbinā ghillal lillażīna āmanū, rabbanā innaka raʾūfur-raḥīm.",
    translation:
      "Ya Tuhan kami, ampunilah kami dan saudara-saudara kami yang telah mendahului kami dalam keimanan, dan janganlah Engkau tanamkan kedengkian dalam hati kami terhadap orang-orang yang beriman. Ya Tuhan kami, sesungguhnya Engkau Maha Penyantun lagi Maha Penyayang.",
    source: "QS. Al-Ḥasyr: 10",
  },
  {
    id: "doa-penutup",
    number: 10,
    title: "Doa Penutup & Al-Fātihah",
    description:
      "Doa kebaikan untuk seluruh kaum muslimin — yang hidup maupun yang telah wafat — sebagai penutup majelis. Diakhiri dengan membaca Al-Fātihah satu kali, pahalanya ditujukan kepada seluruh arwah muslimin.",
    arabic:
      "اللَّهُمَّ اغْفِرْ لِأَحْيَائِنَا وَأَمْوَاتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا",
    transliteration:
      "Allāhummaghfir li-aḥyāʾinā wa amwātinā, wa syāhidinā wa ghāʾibinā, wa ṣaghīrinā wa kabīrinā, wa żakarinā wa unṡānā.",
    translation:
      "Ya Allah, ampunilah orang-orang yang masih hidup dan yang telah wafat di antara kami, yang hadir dan yang tidak hadir, yang masih kecil dan yang sudah dewasa, serta yang laki-laki dan yang perempuan.",
    source: "Doa kebaikan untuk seluruh muslimin — amaliah tahlilan",
  },
];

/** Quick navigation list for the mobile nav / sidebar. */
export const tahlilNav = tahlilSections.map((s) => ({
  id: s.id,
  number: s.number,
  title: s.title,
}));
