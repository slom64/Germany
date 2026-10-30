window.Grammar = [
  {
    id: 'gram_001',
    title: 'German Articles',
    titleAr: 'أدوات التعريف الألمانية',
    level: 'A1',
    sections: [
      {
        heading: 'Definite Articles',
        headingAr: 'أدوات التعريف',
        content: 'In German, there are three genders for nouns: masculine (der), feminine (die), and neuter (das). Plural nouns always use "die".',
        contentAr: 'في اللغة الألمانية، يوجد ثلاثة أجناس للأسماء: المذكر (der)، المؤنث (die)، والمحايد (das). الأسماء في صيغة الجمع تأخذ دائماً (die).',
        examples: [
          { german: 'der Mann', arabic: 'الرجل (مذكر)', note: 'masculine' },
          { german: 'die Frau', arabic: 'المرأة (مؤنث)', note: 'feminine' },
          { german: 'das Kind', arabic: 'الطفل (محايد)', note: 'neuter' },
          { german: 'die Kinder', arabic: 'الأطفال (جمع)', note: 'plural' }
        ],
        table: {
          headers: ['Gender / Plural', 'Nominative (Subject)'],
          rows: [
            ['Masculine', 'der'],
            ['Feminine', 'die'],
            ['Neuter', 'das'],
            ['Plural', 'die']
          ]
        }
      },
      {
        heading: 'Indefinite Articles',
        headingAr: 'أدوات التنكير',
        content: 'Indefinite articles are used when talking about an unspecified item ("a" or "an" in English). There is no indefinite article for plural nouns.',
        contentAr: 'تُستخدم أدوات التنكير عند التحدث عن شيء غير محدد (مثل "a" أو "an" في الإنجليزية). لا توجد أداة تنكير للأسماء في صيغة الجمع.',
        examples: [
          { german: 'ein Mann', arabic: 'رجل', note: 'masculine' },
          { german: 'eine Frau', arabic: 'امرأة', note: 'feminine' },
          { german: 'ein Kind', arabic: 'طفل', note: 'neuter' }
        ],
        table: {
          headers: ['Gender / Plural', 'Nominative (Subject)'],
          rows: [
            ['Masculine', 'ein'],
            ['Feminine', 'eine'],
            ['Neuter', 'ein'],
            ['Plural', '-']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_002',
    title: 'Personal Pronouns',
    titleAr: 'الضمائر الشخصية',
    level: 'A1',
    sections: [
      {
        heading: 'Nominative Case Pronouns',
        headingAr: 'ضمائر حالة الرفع',
        content: 'Personal pronouns replace nouns. Note that "sie" can mean "she", "they", or (capitalized "Sie") formal "you".',
        contentAr: 'الضمائر الشخصية تحل محل الأسماء. لاحظ أن "sie" يمكن أن تعني "هي"، "هم"، أو (عندما تُكتب بحرف كبير "Sie") تعني "أنت / أنتم" بصيغة الاحترام.',
        examples: [
          { german: 'Ich lerne Deutsch.', arabic: 'أنا أتعلم الألمانية.', note: '1st person singular' },
          { german: 'Du bist nett.', arabic: 'أنت لطيف.', note: '2nd person singular informal' },
          { german: 'Sie sind der Chef.', arabic: 'حضرتك المدير.', note: '2nd person formal' }
        ],
        table: {
          headers: ['German', 'Arabic', 'Usage'],
          rows: [
            ['ich', 'أنا', '1st Person Sg.'],
            ['du', 'أنت', '2nd Person Sg. Informal'],
            ['er / sie / es', 'هو / هي / هو (للمحايد)', '3rd Person Sg.'],
            ['wir', 'نحن', '1st Person Pl.'],
            ['ihr', 'أنتم', '2nd Person Pl. Informal'],
            ['sie', 'هم / هن', '3rd Person Pl.'],
            ['Sie', 'حضرتك / حضراتكم', 'Formal You (Sg. & Pl.)']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_003',
    title: 'Present Tense Verb Conjugation',
    titleAr: 'تصريف الأفعال في المضارع',
    level: 'A1',
    sections: [
      {
        heading: 'Regular Verbs (Schwache Verben)',
        headingAr: 'الأفعال المنتظمة',
        content: 'Most German verbs end in "-en". To conjugate them in the present tense, remove the "-en" to get the stem, then add the appropriate ending.',
        contentAr: 'معظم الأفعال الألمانية تنتهي بـ "-en". لتصريفها في زمن المضارع، احذف الـ "-en" للحصول على الجذر، ثم أضف النهاية المناسبة.',
        examples: [
          { german: 'lernen', arabic: 'يتعلم', note: 'Infinitive' },
          { german: 'Ich lerne', arabic: 'أنا أتعلم', note: 'ich form (-e)' }
        ],
        table: {
          headers: ['Pronoun', 'Ending', 'Example: machen (to do/make)'],
          rows: [
            ['ich', '-e', 'mache'],
            ['du', '-st', 'machst'],
            ['er/sie/es', '-t', 'macht'],
            ['wir', '-en', 'machen'],
            ['ihr', '-t', 'macht'],
            ['sie/Sie', '-en', 'machen']
          ]
        }
      },
      {
        heading: 'Important Irregular Verbs: sein & haben',
        headingAr: 'الأفعال الشاذة المهمة: sein و haben',
        content: '"sein" (to be) and "haben" (to have) are highly irregular but essential.',
        contentAr: '"sein" (يكون) و "haben" (يملك) أفعال شاذة جداً ولكنها ضرورية.',
        table: {
          headers: ['Pronoun', 'sein (to be)', 'haben (to have)'],
          rows: [
            ['ich', 'bin', 'habe'],
            ['du', 'bist', 'hast'],
            ['er/sie/es', 'ist', 'hat'],
            ['wir', 'sind', 'haben'],
            ['ihr', 'seid', 'habt'],
            ['sie/Sie', 'sind', 'haben']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_004',
    title: 'Sentence Structure',
    titleAr: 'بناء الجملة',
    level: 'A1',
    sections: [
      {
        heading: 'The V2 Rule',
        headingAr: 'قاعدة الفعل في المركز الثاني',
        content: 'In standard declarative sentences, the conjugated verb is ALWAYS the second element in the sentence. Other parts can move around, but the verb stays in position 2.',
        contentAr: 'في الجمل الخبرية العادية، يكون الفعل المُصرّف دائماً العنصر الثاني في الجملة. يمكن للأجزاء الأخرى أن تتغير أماكنها، لكن الفعل يبقى في المركز 2.',
        examples: [
          { german: 'Ich lerne heute Deutsch.', arabic: 'أنا أتعلم الألمانية اليوم.', note: 'Subject first' },
          { german: 'Heute lerne ich Deutsch.', arabic: 'اليوم أتعلم الألمانية.', note: 'Time first, verb is still second' }
        ]
      },
      {
        heading: 'Questions',
        headingAr: 'الأسئلة',
        content: 'For Yes/No questions, the verb moves to the first position. For W-questions (who, what, where), the question word is first and the verb is second.',
        contentAr: 'لأسئلة (نعم/لا)، ينتقل الفعل إلى المركز الأول. أما لأسئلة (W) مثل من، ماذا، أين، فتأتي كلمة الاستفهام أولاً والفعل ثانياً.',
        examples: [
          { german: 'Lernst du Deutsch?', arabic: 'هل تتعلم الألمانية؟', note: 'Yes/No question' },
          { german: 'Was lernst du?', arabic: 'ماذا تتعلم؟', note: 'W-question' }
        ]
      }
    ]
  },
  {
    id: 'gram_005',
    title: 'Accusative Case Basics',
    titleAr: 'أساسيات حالة النصب (المفعول به)',
    level: 'A1',
    sections: [
      {
        heading: 'Direct Objects',
        headingAr: 'المفعول به المباشر',
        content: 'The accusative case is used for direct objects. Crucially, ONLY the masculine articles change (der -> den, ein -> einen). Feminine, neuter, and plural articles stay the same as in the nominative.',
        contentAr: 'تُستخدم حالة النصب للمفعول به المباشر. بشكل حاسم، أدوات المذكر فقط هي التي تتغير (der -> den, ein -> einen). أدوات المؤنث والمحايد والجمع تبقى كما هي في حالة الرفع.',
        table: {
          headers: ['Gender', 'Nominative', 'Accusative'],
          rows: [
            ['Masculine', 'der / ein', 'den / einen'],
            ['Feminine', 'die / eine', 'die / eine'],
            ['Neuter', 'das / ein', 'das / ein'],
            ['Plural', 'die / -', 'die / -']
          ]
        },
        examples: [
          { german: 'Ich habe einen Apfel.', arabic: 'لدي تفاحة. (مذكر)', note: 'einen (masculine accusative)' },
          { german: 'Er isst die Pizza.', arabic: 'هو يأكل البيتزا. (مؤنث)', note: 'die (feminine, unchanged)' }
        ]
      }
    ]
  },
  {
    id: 'gram_006',
    title: 'Common Prepositions',
    titleAr: 'حروف الجر الشائعة',
    level: 'A2',
    sections: [
      {
        heading: 'Accusative Prepositions',
        headingAr: 'حروف جر تنصب المجرور',
        content: 'Some prepositions always require the accusative case: durch, für, gegen, ohne, um.',
        contentAr: 'بعض حروف الجر تتطلب دائماً حالة النصب: durch (عبر/بواسطة), für (لأجل/من أجل), gegen (ضد), ohne (بدون), um (حول/في تمام).',
        examples: [
          { german: 'Das Geschenk ist für den Vater.', arabic: 'الهدية من أجل الأب.', note: 'für + accusative (den)' },
          { german: 'Wir gehen ohne den Hund spazieren.', arabic: 'نحن نذهب للتنزه بدون الكلب.', note: 'ohne + accusative (den)' }
        ]
      }
    ]
  },
  {
    id: 'gram_007',
    title: 'Numbers and Counting',
    titleAr: 'الأرقام والعد',
    level: 'A1',
    sections: [
      {
        heading: 'Forming Numbers 21-99',
        headingAr: 'تكوين الأرقام 21-99',
        content: 'Unlike in English, German numbers between 21 and 99 are spoken with the units first, then "und", then the tens. (e.g., one-and-twenty).',
        contentAr: 'على عكس الإنجليزية، تُقرأ الأرقام الألمانية بين 21 و 99 بالآحاد أولاً، ثم "und" (و)، ثم العشرات. (مثل: واحد وعشرون).',
        examples: [
          { german: 'einundzwanzig (21)', arabic: 'واحد وعشرون', note: 'ein (1) + und (+) + zwanzig (20)' },
          { german: 'fünfundvierzig (45)', arabic: 'خمسة وأربعون', note: 'fünf (5) + und (+) + vierzig (40)' }
        ]
      }
    ]
  },
  {
    id: 'gram_008',
    title: 'Plural Formation Rules',
    titleAr: 'قواعد تكوين الجمع',
    level: 'A1',
    sections: [
      {
        heading: 'Multiple Plural Endings',
        headingAr: 'نهايات الجمع المتعددة',
        content: 'German does not have a single rule for making nouns plural. Common endings are -e, -en, -er, -s, or no ending at all. Sometimes an umlaut (ä, ö, ü) is added.',
        contentAr: 'لا توجد في الألمانية قاعدة واحدة لجمع الأسماء. النهايات الشائعة هي -e, -en, -er, -s، أو بدون نهاية على الإطلاق. أحياناً يتم إضافة الإمالة (ä, ö, ü).',
        table: {
          headers: ['Singular', 'Plural', 'Ending Rule'],
          rows: [
            ['das Kind (child)', 'die Kinder', '-er'],
            ['die Frau (woman)', 'die Frauen', '-en'],
            ['das Auto (car)', 'die Autos', '-s (often foreign words)'],
            ['der Apfel (apple)', 'die Äpfel', 'umlaut, no ending']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_009',
    title: 'Passive Voice (Passiv)',
    titleAr: 'المبني للمجهول (Passiv)',
    level: 'B1-B2',
    sections: [
      {
        heading: 'Vorgangspassiv (werden + Partizip II)',
        headingAr: 'المبني للمجهول الحركي (werden + اسم المفعول)',
        content: 'The passive voice shifts focus from who does the action to the action itself. Vorgangspassiv uses conjugated "werden" in the appropriate tense and places the Partizip II at the end of the clause. To mention the agent, use "von + Dativ" (people/causes) or "durch + Akkusativ" (means/instruments).',
        contentAr: 'يُنقل التركيز في صيغة المبني للمجهول من الفاعل إلى الحدث نفسه. يتكون المبني للمجهول الحركي من تصريف فعل "werden" مع اسم المفعول (Partizip II) في نهاية الجملة. لذكر الفاعل نستخدم "von + Dativ" (للأشخاص/المسببات) أو "durch + Akkusativ" (للوسائل).',
        examples: [
          { german: 'Der Bericht wird von der Kommission geschrieben.', arabic: 'يُكتب التقرير من قبل اللجنة. (مضارع)', note: 'Präsens' },
          { german: 'Das Gesetz wurde gestern verabschiedet.', arabic: 'تم إقرار القانون بالأمس. (ماضٍ بسيط)', note: 'Präteritum' },
          { german: 'Die Daten sind analysiert worden.', arabic: 'تم تحليل البيانات. (ماضٍ تام)', note: 'Perfekt' },
          { german: 'Das Problem muss sofort gelöst werden.', arabic: 'يجب حل المشكلة فوراً. (مع فعل مساعد)', note: 'Mit Modalverb' }
        ],
        table: {
          headers: ['Tense / Zeitform', 'Structure / التركيب', 'Example / مثال'],
          rows: [
            ['Präsens', 'wird + Partizip II', 'Das Auto wird repariert.'],
            ['Präteritum', 'wurde + Partizip II', 'Das Auto wurde repariert.'],
            ['Perfekt', 'ist + Partizip II + worden', 'Das Auto ist repariert worden.'],
            ['Plusquamperfekt', 'war + Partizip II + worden', 'Das Auto war repariert worden.'],
            ['Futur I', 'wird + Partizip II + werden', 'Das Auto wird repariert werden.'],
            ['Mit Modalverb', 'kann/muss + Partizip II + werden', 'Das Auto muss repariert werden.']
          ]
        }
      },
      {
        heading: 'Zustandspassiv (sein + Partizip II)',
        headingAr: 'المبني للمجهول للحالة (sein + اسم المفعول)',
        content: 'Zustandspassiv describes the resulting state after an action has been completed, formed with "sein + Partizip II".',
        contentAr: 'يصف المبني للمجهول للحالة (Zustandspassiv) الحالة الناتجة بعد اكتمال الفعل، ويتكون من "sein + Partizip II".',
        examples: [
          { german: 'Die Tür ist geschlossen.', arabic: 'الباب مغلق. (حالة مكتملة)', note: 'Zustand' },
          { german: 'Das Geschäft war bereits geschlossen.', arabic: 'كان المتجر مغلقاً بالفعل.', note: 'Präteritum Zustand' }
        ]
      }
    ]
  },
  {
    id: 'gram_010',
    title: 'Subjunctive II (Konjunktiv II)',
    titleAr: 'صيغة الاحتمال والتمني والشرط (Konjunktiv II)',
    level: 'B1-B2',
    sections: [
      {
        heading: 'Wishes, Hypotheticals & Polite Requests',
        headingAr: 'التمني والافتراض والطلب بأدب',
        content: 'Konjunktiv II expresses unreal conditions, wishes, hypothetical situations, and polite requests. For most verbs, it is formed with "würde + Infinitiv". The verbs "sein", "haben", and modal verbs use their distinct original Konjunktiv II forms (wäre, hätte, könnte, müsste, sollte).',
        contentAr: 'تُستخدم صيغة Konjunktiv II للتعبير عن التمني، الشروط الافتراضية غير الواقعية، والمطالب شديدة التهذيب. لمعظم الأفعال نستخدم "würde + المصدر". أفعال "sein" و "haben" والأفعال المساعدة لها أشكال خاصة (wäre, hätte, könnte, müsste, sollte).',
        examples: [
          { german: 'Könnten Sie mir bitte helfen?', arabic: 'هل بإمكان حضرتك مساعدتي من فضلك؟ (طلب مهذب)', note: 'Höflichkeit' },
          { german: 'Ich hätte gern eine Tasse Kaffee.', arabic: 'أود فنجاناً من القهوة من فضلك.', note: 'Wunsch' },
          { german: 'Wenn ich mehr Zeit hätte, würde ich nach Deutschland reisen.', arabic: 'لو كان لدي وقت أكبر، لسافرتُ إلى ألمانيا.', note: 'Irrealer Konditionalsatz' },
          { german: 'An deiner Stelle würde ich den Vertrag unterschreiben.', arabic: 'لو كنتُ في مكانك، لوقّعتُ العقد.', note: 'Ratschlag' }
        ],
        table: {
          headers: ['Pronoun', 'haben (hätte)', 'sein (wäre)', 'werden (würde)', 'können (könnte)'],
          rows: [
            ['ich', 'hätte', 'wäre', 'würde', 'könnte'],
            ['du', 'hättest', 'wärest', 'würdest', 'könntest'],
            ['er/sie/es', 'hätte', 'wäre', 'würde', 'könnte'],
            ['wir', 'hätten', 'wären', 'würden', 'könnten'],
            ['ihr', 'hättet', 'wäret', 'würdet', 'könntet'],
            ['sie/Sie', 'hätten', 'wären', 'würden', 'könnten']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_011',
    title: 'Relative Clauses (Relativsätze)',
    titleAr: 'جمل الوصل والصلة في جميع الحالات (Relativsätze)',
    level: 'B1-B2',
    sections: [
      {
        heading: 'Relative Pronouns in Nominative, Accusative, Dative & Genitive',
        headingAr: 'ضمائر الوصل في حالات الرفع والنصب والجر والإضافة',
        content: 'A relative clause gives extra details about a noun in the main clause. The gender and number of the relative pronoun depend on the antecedent noun; its grammatical case depends on its grammatical function inside the relative clause. In relative clauses, the conjugated verb moves to the very end.',
        contentAr: 'تُعطي جملة الوصل معلومات إضافية عن اسم في الجملة الرئيسية. يُحدد جنس وعدد ضمير الوصل الاسم العائد عليه، بينما تُحدد حالته الإعرابية (Case) وظيفته داخل جملة الوصل نفسها. يتحرك الفعل المصرف دائماً إلى نهاية جملة الوصل.',
        examples: [
          { german: 'Der Kollege, der die Präsentation gehalten hat, ist krank.', arabic: 'الزميل الذي قدّم العرض التقديمي مريض. (فاعل / Nominativ)', note: 'Maskulin Nominativ' },
          { german: 'Das Buch, das ich gestern gekauft habe, ist spannend.', arabic: 'الكتاب الذي اشتريته بالأمس مشوّق. (مفعول به / Akkusativ)', note: 'Neutral Akkusativ' },
          { german: 'Die Frau, der ich geholfen habe, bedankte sich herzlich.', arabic: 'المرأة التي ساعدتُها شكرتني بحرارة. (مجرور / Dativ)', note: 'Feminin Dativ' },
          { german: 'Der Student, dessen Noten hervorragend sind, bekommt ein Stipendium.', arabic: 'الطالب الذي درجاته ممتازة يحصل على منحة دراسية. (مضاف إليه / Genitiv)', note: 'Maskulin Genitiv' },
          { german: 'Das Projekt, an dem wir arbeiten, ist sehr zukunftsweisend.', arabic: 'المشروع الذي نعمل عليه واعد ومستقبلي للغاية. (مع حرف جر)', note: 'Mit Präposition' }
        ],
        table: {
          headers: ['Case', 'Maskulin', 'Feminin', 'Neutral', 'Plural'],
          rows: [
            ['Nominativ', 'der', 'die', 'das', 'die'],
            ['Akkusativ', 'den', 'die', 'das', 'die'],
            ['Dativ', 'dem', 'der', 'dem', 'denen'],
            ['Genitiv', 'dessen', 'deren', 'dessen', 'deren']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_012',
    title: 'Genitive Case & Prepositions (Genitiv)',
    titleAr: 'حالة الإضافة وحروف الجر الملازمة لها (Genitiv)',
    level: 'B1-B2',
    sections: [
      {
        heading: 'Genitive Case Endings & Usage',
        headingAr: 'علامات الإضافة واستخداماتها',
        content: 'The Genitive case indicates possession, belonging, or association ("des / der / des / der"). Masculine and neuter nouns add an "-s" or "-es" ending. In formal German, academic texts, and media, Genitive is essential.',
        contentAr: 'تُعبر حالة الإضافة (Genitiv) عن الملكية أو الانتماء ("des / der / des / der"). تُضاف نهاية "-s" أو "-es" للأسماء المذكرة والمحايدة. تُعد حالة الإضافة ركيزة أساسية في النصوص الأكاديمية والرسمية والإعلامية في مستوى B2.',
        examples: [
          { german: 'Die Zukunft des Landes hängt von Bildung ab.', arabic: 'مستقبل البلاد يعتمد على التعليم.', note: 'des Landes (Maskulin/Neutral -es)' },
          { german: 'Die Entscheidung der Ministerin war überraschend.', arabic: 'كان قرار الوزيرة مفاجئاً.', note: 'der Ministerin (Feminin)' },
          { german: 'Die Meinungen der Experten sind geteilt.', arabic: 'آراء الخبراء منقسمة.', note: 'der Experten (Plural)' }
        ],
        table: {
          headers: ['Article Type', 'Maskulin', 'Feminin', 'Neutral', 'Plural'],
          rows: [
            ['Bestimmt (Definite)', 'des Vaters (-s/-es)', 'der Mutter', 'des Kindes (-s/-es)', 'der Eltern'],
            ['Unbestimmt (Indefinite)', 'eines Mannes', 'einer Frau', 'eines Kindes', '-'],
            ['Possessiv', 'meines Bruders', 'meiner Schwester', 'meines Hauses', 'meiner Kollegen']
          ]
        }
      },
      {
        heading: 'Core Genitive Prepositions: wegen, trotz, während, statt',
        headingAr: 'أهم حروف الجر التي تجر بالـ Genitiv',
        content: 'The most frequent B1/B2 prepositions requiring the Genitive are: wegen (because of), trotz (despite), während (during), statt / anstatt (instead of), innerhalb (within), außerhalb (outside of).',
        contentAr: 'أهم حروف الجر التي تفرض حالة الإضافة (Genitiv) في مستويات B1/B2 هي: wegen (بسبب)، trotz (رغم)، während (أثناء / خلال)، statt (بدلاً من)، innerhalb (داخل / في غضون)، außerhalb (خارج).',
        examples: [
          { german: 'Wegen des starken Regens wurde das Spiel abgesagt.', arabic: 'بسبب المطر الشديد أُلغيت المباراة.', note: 'wegen + Genitiv' },
          { german: 'Trotz der wirtschaftlichen Krise wächst das Unternehmen.', arabic: 'رغم الأزمة الاقتصادية، فإن الشركة تنمو.', note: 'trotz + Genitiv' },
          { german: 'Während meines Studiums habe ich in Berlin gewohnt.', arabic: 'أثناء دراستي الجامعية عشتُ في برلين.', note: 'während + Genitiv' },
          { german: 'Statt einer Entschuldigung schwieg er.', arabic: 'بدلاً من الاعتذار، التزم الصمت.', note: 'statt + Genitiv' }
        ]
      }
    ]
  },
  {
    id: 'gram_013',
    title: 'Verbs with Fixed Prepositions & Da-/Wo- Compounds',
    titleAr: 'أفعال مع حروف جر محددة ومركبات Da- / Wo-',
    level: 'B1-B2',
    sections: [
      {
        heading: 'Prepositional Verbs (Verben mit festen Präpositionen)',
        headingAr: 'الأفعال المرتبطة بحروف جر ثابتة وحالاتها',
        content: 'Many B1/B2 verbs require a specific preposition and a specific grammatical case (Dativ or Akkusativ). Memorizing the combination is mandatory for high-level proficiency.',
        contentAr: 'تتطلب العديد من أفعال مستويي B1 و B2 حرف جر ثابتاً وحالة إعرابية محددة (Dativ أو Akkusativ). حفظ الفعل مع حرف جره وحالته أمر حتمي لإتقان الألمانية.',
        examples: [
          { german: 'Der Erfolg hängt von harter Arbeit ab.', arabic: 'النجاح يعتمد على العمل الجاد. (abhängen von + Dativ)', note: 'von + Dativ' },
          { german: 'Ich freue mich auf die Reise nächste Woche.', arabic: 'أتطلع بشوق إلى الرحلة الأسبوع القادم. (sich freuen auf + Akkusativ)', note: 'auf + Akkusativ' },
          { german: 'Wir diskutieren über die aktuelle Wirtschaftslage.', arabic: 'نحن نناقش الوضع الاقتصادي الراهن. (diskutieren über + Akkusativ)', note: 'über + Akkusativ' },
          { german: 'Er beschäftigt sich mit künstlicher Intelligenz.', arabic: 'هو ينشغل / يهتم بالذكاء الاصطناعي. (sich beschäftigen mit + Dativ)', note: 'mit + Dativ' }
        ]
      },
      {
        heading: 'Pronominal Adverbs (worauf / darauf, wovon / davon)',
        headingAr: 'الظروف الضميرية للأشياء مقابل الأشخاص',
        content: 'When referring to things or abstract concepts, use "da(r) + preposition" and ask questions with "wo(r) + preposition". When referring to human beings, use the preposition followed by the pronoun (auf wen? an wen? mit wem?).',
        contentAr: 'للإشارة إلى الأشياء أو الأفكار المجردة، ندمج da(r) مع حرف الجر (مثل darauf, damit)، وفي السؤال نستخدم wo(r) (مثل worauf, womit). أما عند الإشارة للأشخاص، فنستخدم حرف الجر متبوعاً بالضمير المناسب (auf wen؟ mit wem؟).',
        examples: [
          { german: 'Worauf wartest du? — Ich warte auf den Bus. / Ich warte darauf.', arabic: 'ماذا تنتظر؟ — أنتظر الحافلة / أنتظر ذلك.', note: 'Sache / Thing' },
          { german: 'Auf wen wartest du? — Ich warte auf meine Schwester.', arabic: 'من تنتظر؟ — أنتظر أختي.', note: 'Person' },
          { german: 'Interessierst du dich dafür? — Ja, ich interessiere mich sehr dafür.', arabic: 'هل تهتم بذلك؟ — نعم، أنا مهتم جداً بذلك.', note: 'dafür' }
        ]
      }
    ]
  },
  {
    id: 'gram_014',
    title: 'Two-Part Connectors (Zweiteilige Konnektoren)',
    titleAr: 'أدوات الربط الثنائية المتقدمة (Zweiteilige Konnektoren)',
    level: 'B2',
    sections: [
      {
        heading: 'Complex Sentence Logic and Multi-Part Conjunctions',
        headingAr: 'الروابط المزدوجة لبناء الحجج البلاغية والمنطقية',
        content: 'Two-part connectors give structure, nuance, and elegance to B2 spoken and written discourse. They connect elements within a sentence or balance contrasting ideas.',
        contentAr: 'تمنح أدوات الربط المزدوجة البلاغة والتناسق والدقة الأسلوبية للمحادثة والكتابة في مستوى B2. تُستخدم لربط عناصر متعددة أو الموازنة بين أفكار متناقضة.',
        examples: [
          { german: 'Er spricht nicht nur fließend Deutsch, sondern auch hervorragend Englisch.', arabic: 'هو لا يتحدث الألمانية بطلاقة فحسب، بل والإنجليزية بشكل ممتاز أيضاً.', note: 'nicht nur... sondern auch (Addition)' },
          { german: 'Das Angebot ist sowohl qualitativ hochwertig als auch bezahlbar.', arabic: 'العرض عالي الجودة وميسور التكلفة في الوقت ذاته.', note: 'sowohl... als auch (Both)' },
          { german: 'Wir haben weder Zeit noch Geld für dieses Experiment.', arabic: 'ليس لدينا لا وقت ولا مال لهذه التجربة.', note: 'weder... noch (Negative neither/nor)' },
          { german: 'Entweder wir finden eine Lösung, oder das Projekt scheitert.', arabic: 'إما أن نجد حلاً، أو سيفشل المشروع.', note: 'entweder... oder (Alternative)' },
          { german: 'Die Arbeit ist zwar anstrengend, aber sehr befriedigend.', arabic: 'العمل مُرهق صحيح، لكنه مُرضٍ ومجزٍ جداً.', note: 'zwar... aber (Concession)' },
          { german: 'Je mehr man übt, desto besser beherrscht man die Sprache.', arabic: 'كلما تدرّب المرء أكثر، كلما أتقن اللغة بشكل أفضل.', note: 'je... desto / umso (Proportion)' }
        ],
        table: {
          headers: ['Connector / الرابط', 'Function / الوظيفة', 'Grammar / القواعد'],
          rows: [
            ['nicht nur ... sondern auch', 'Addition (إضافة إيجابية)', 'Verbindet Wörter oder Hauptsätze'],
            ['sowohl ... als auch', 'Double Affirmation (تأكيد مزدوج)', 'Kein Komma nötig bei Aufzählungen'],
            ['weder ... noch', 'Double Negation (نفي مزدوج)', 'Keine weitere Verneinung (kein "nicht")'],
            ['entweder ... oder', 'Alternative (خيار حصري)', 'oder verbindet gleichwertige Satzglieder'],
            ['zwar ... aber', 'Concession (استدراك وتنازل)', 'drückt einen Gegensatz aus'],
            ['je ... desto/umso', 'Proportion (تناسب طردي)', 'je + Nebensatz (Verb am Ende), desto + Hauptsatz']
          ]
        }
      }
    ]
  },
  {
    id: 'gram_015',
    title: 'Infinitive with "zu" (Infinitiv mit zu)',
    titleAr: 'المصدر المقترن بـ "zu" والجمل الغائية',
    level: 'B1-B2',
    sections: [
      {
        heading: 'Rules for "Infinitiv mit zu", "um... zu", "ohne... zu", "anstatt... zu"',
        headingAr: 'قواعد المصدر مع zu وتراكيب الغاية والشرط',
        content: 'In German, an infinitive clause with "zu" is used after certain verbs (hoffen, planen, beabsichtigen, vergessen), adjectives (es ist wichtig, schön, schwierig), and nouns with "haben" (Zeit/Lust/Geld haben). With separable verbs, "-zu-" is inserted between the prefix and stem (anzufangen, aufzuhören). Special prepositional infinitive constructions include: um... zu (in order to), ohne... zu (without doing), anstatt... zu (instead of doing).',
        contentAr: 'تُستخدم جمل المصدر المقترنة بـ "zu" بعد أفعال معينة (مثل hoffen, vorhaben, vergessen)، أو صفات (es ist wichtig/schwierig)، أو أسماء مع haben (Lust/Zeit haben). في الأفعال المنفصلة تدخل "zu" بين السابقة وجذر الفعل (مثل anzukommen). من أهم التراكيب المتقدمة: um... zu (لأجل/كي)، ohne... zu (دون أن)، anstatt... zu (بدلاً من أن).',
        examples: [
          { german: 'Ich habe vor, dieses Jahr die B2-Prüfung zu bestehen.', arabic: 'أعتزم اجتياز امتحان B2 هذا العام.', note: 'vorhaben... zu' },
          { german: 'Es ist ratsam, jeden Tag neue Wörter zu wiederholen.', arabic: 'من المستحسن مراجعة كلمات جديدة كل يوم.', note: 'es ist ratsam... zu' },
          { german: 'Er lernt fleißig, um in Deutschland Medizin zu studieren.', arabic: 'هو يدرس بجد كي يدرس الطب في ألمانيا.', note: 'um... zu (Purpose / غاية)' },
          { german: 'Sie verließ den Raum, ohne ein Wort zu sagen.', arabic: 'غادرت الغرفة دون أن تنطق بكلمة.', note: 'ohne... zu (Without)' },
          { german: 'Er ging ins Kino, anstatt für die Prüfung zu lernen.', arabic: 'ذهب إلى السينما بدلاً من أن يدرس للامتحان.', note: 'anstatt... zu (Instead of)' }
        ]
      }
    ]
  },
  {
    id: 'gram_016',
    title: 'N-Declension (N-Deklination)',
    titleAr: 'الأسماء الضعيفة وإعراب النون (N-Deklination)',
    level: 'B2',
    sections: [
      {
        heading: 'Weak Masculine Nouns (Schwache Maskulina)',
        headingAr: 'قواعد تصريف الأسماء المذكرة الضعيفة',
        content: 'A specific group of masculine nouns takes an "-n" or "-en" suffix in all cases except the singular nominative. These include masculine nouns ending in "-e" referring to living beings (der Kunde, der Kollege, der Nachbar, der Junge), professions/people ending in foreign suffixes like "-ist", "-ant", "-ent", "-at" (der Student, der Journalist, der Praktikant, der Diplomat), and a few exceptions (der Mensch, der Herr, der Name).',
        contentAr: 'مجموعة محددة من الأسماء المذكرة تُسمى "الأسماء الضعيفة"، تأخذ نهاية "-n" أو "-en" في جميع الحالات الإعرابية (النصب، الجر، الإضافة) عدا حالة الرفع المفرد. تشمل الأسماء المنتهية بـ "-e" للكائنات الحية (der Kollege, der Kunde)، والأسماء ذات النهايات الأجنبية (der Student, der Journalist, der Assistent)، وكلمات شائعة مثل (der Herr, der Mensch, der Name).',
        examples: [
          { german: 'Der Student (Nom.) spricht mit dem Professor.', arabic: 'الطالب يتحدث مع الأستاذ. (رفع - بدون n)', note: 'Nominativ' },
          { german: 'Ich kenne diesen Studenten (Akk.) schon lange.', arabic: 'أعرف هذا الطالب منذ فترة طويلة. (نصب - إضافة en)', note: 'Akkusativ' },
          { german: 'Ich habe dem Kunden (Dat.) die Rechnung geschickt.', arabic: 'أرسلتُ الفاتورة إلى العميل. (جر - إضافة n)', note: 'Dativ' },
          { german: 'Das Büro des Präsidenten (Gen.) befindet sich im ersten Stock.', arabic: 'يقع مكتب الرئيس في الطابق الأول. (إضافة - إضافة en)', note: 'Genitiv' },
          { german: 'Guten Tag, Herr Müller! — Ich spreche mit Herrn Müller.', arabic: 'طاب يومك يا سيد مولر! — أنا أتحدث مع السيد مولر.', note: 'Herr -> Herrn' }
        ],
        table: {
          headers: ['Case', 'der Student (Student)', 'der Kollege (Colleague)', 'der Herr (Mister)'],
          rows: [
            ['Nominativ (Nom.)', 'der Student', 'der Kollege', 'der Herr'],
            ['Akkusativ (Akk.)', 'den Studenten', 'den Kollegen', 'den Herrn'],
            ['Dativ (Dat.)', 'dem Studenten', 'dem Kollegen', 'dem Herrn'],
            ['Genitiv (Gen.)', 'des Studenten', 'des Kollegen', 'des Herrn']
          ]
        }
      }
    ]
  }
];

