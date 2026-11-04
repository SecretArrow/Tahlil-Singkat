# Tahlil Singkat — R8/ProGuard rules.
#
# The Compose libraries ship their own consumer ProGuard rules, so the default
# proguard-android-optimize.txt (referenced in build.gradle.kts) is enough for
# this app: it uses no reflection, no Gson/serialization, and plain SharedPreferences.
# These keep-attributes are retained for completeness / stack-trace readability.

-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod, SourceFile, LineNumberTable

# Keep the bundled font resources (referenced via Font(R.font.*) in code).
-keep class androidx.compose.ui.text.font.Font { *; }
