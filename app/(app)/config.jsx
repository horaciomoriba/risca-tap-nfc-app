import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Platform, Modal } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { useTheme } from '../../hooks/useTheme';

NfcManager.start();

export default function Config() {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [writing, setWriting] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.bg === '#0d0d0d';

  useEffect(() => {
    checkNfc();
    return () => { NfcManager.cancelTechnologyRequest(); };
  }, []);

  const checkNfc = async () => {
    const supported = await NfcManager.isSupported();
    setNfcSupported(supported);
    if (supported) await NfcManager.start();
  };

  const handleRead = async () => {
    if (!nfcSupported) {
      Toast.show({ type: 'error', text1: 'NFC not supported' });
      return;
    }
    try {
      setScanning(true);
      setCurrentTag(null);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag?.ndefMessage?.length > 0) {
        const record = tag.ndefMessage[0];
        let decoded = '';
        try {
          decoded = Ndef.text.decodePayload(record.payload);
        } catch {
          decoded = Ndef.uri.decodePayload(record.payload);
        }
        setCurrentTag({
          uid: tag.id,
          content: decoded,
          type: record.tnf === 1 ? 'Text' : 'URI',
          records: tag.ndefMessage.length,
          raw: tag,
        });
        Toast.show({ type: 'success', text1: 'Card read ✓', text2: decoded });
      } else {
        // Tarjeta vacía
        setCurrentTag({
          uid: tag.id,
          content: null,
          type: 'Empty',
          records: 0,
          raw: tag,
        });
        Toast.show({ type: 'info', text1: 'Empty card', text2: 'Ready to write' });
      }
    } catch (e) {
      if (e.toString().includes('cancelled')) return;
      Toast.show({ type: 'error', text1: 'Read failed', text2: e.toString() });
    } finally {
      setScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(JSON.stringify(currentTag?.raw, null, 2));
    Toast.show({ type: 'success', text1: 'Copied ✓', text2: 'Raw data copied to clipboard' });
  };

  const handleWrite = async () => {
    if (!url) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a URL first' });
      return;
    }
    if (!nfcSupported) {
      Toast.show({ type: 'error', text1: 'NFC not supported' });
      return;
    }
    try {
      setWriting(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      Toast.show({ type: 'success', text1: 'Card written ✓', text2: url });
      setCurrentTag((prev) => ({ ...prev, content: url, type: 'URI' }));
      setUrl('');
      setLabel('');
    } catch (e) {
      if (e.toString().includes('cancelled')) return;
      Toast.show({ type: 'error', text1: 'Write failed', text2: 'Could not write to the card' });
    } finally {
      setWriting(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const handleCancel = () => {
    NfcManager.cancelTechnologyRequest();
    setScanning(false);
    setWriting(false);
  };

  return (
    <ScrollView
      style={[s.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Glow */}
      <View style={[s.glowTop, { backgroundColor: theme.accent }]} />

      {/* Header */}
      <View style={s.header}>
        <Text style={[s.title, { color: theme.text }]}>{t('config.title')}</Text>
        <Text style={[s.subtitle, { color: theme.textMuted }]}>{t('config.subtitle')}</Text>
      </View>

      {/* NFC Status badge */}
      <View style={[s.nfcBadge, { backgroundColor: nfcSupported ? '#22c55e22' : '#ef444422' }]}>
        <Ionicons
          name={nfcSupported ? 'checkmark-circle' : 'close-circle'}
          size={14}
          color={nfcSupported ? '#22c55e' : '#ef4444'}
        />
        <Text style={[s.nfcBadgeText, { color: nfcSupported ? '#22c55e' : '#ef4444' }]}>
          {nfcSupported ? 'NFC available' : 'NFC not available'}
        </Text>
      </View>

      {/* Step 1 — Read */}
      <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Step 1 — Read card</Text>
      <View style={[s.card, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[s.nfcButton, { borderColor: scanning ? theme.accent : theme.border }]}
          onPress={scanning ? handleCancel : handleRead}
          activeOpacity={0.8}
          disabled={!nfcSupported}
        >
          <View style={[s.nfcIconBox, { backgroundColor: scanning ? theme.accentSoft : theme.accentDim }]}>
            <Ionicons
              name={scanning ? 'radio-outline' : 'wifi-outline'}
              size={28}
              color={theme.accent}
            />
          </View>
          <View style={s.nfcButtonInfo}>
            <Text style={[s.nfcButtonTitle, { color: theme.text }]}>
              {scanning ? 'Scanning... tap to cancel' : 'Scan card'}
            </Text>
            <Text style={[s.nfcButtonSub, { color: theme.textMuted }]}>
              {scanning ? 'Bring your NFC card closer' : 'Read current card content'}
            </Text>
          </View>
          {scanning
            ? <View style={[s.cancelBadge, { backgroundColor: '#ef444422' }]}>
                <Text style={s.cancelText}>Cancel</Text>
              </View>
            : <Ionicons name="chevron-forward" size={16} color={theme.border} />
          }
        </TouchableOpacity>

        {/* Resultado lectura */}
        {currentTag && (
          <>
            <View style={[s.divider, { backgroundColor: theme.bg }]} />
            <View style={s.tagResult}>
              <View style={s.tagRow}>
                <Text style={[s.tagKey, { color: theme.textMuted }]}>UID</Text>
                <Text style={[s.tagValue, { color: theme.text }]}>{currentTag.uid || '—'}</Text>
              </View>
              <View style={s.tagRow}>
                <Text style={[s.tagKey, { color: theme.textMuted }]}>Type</Text>
                <Text style={[s.tagValue, { color: theme.text }]}>{currentTag.type}</Text>
              </View>
              <View style={s.tagRow}>
                <Text style={[s.tagKey, { color: theme.textMuted }]}>Content</Text>
                <Text style={[s.tagValue, { color: currentTag.content ? theme.accent : theme.textMuted }]} numberOfLines={2}>
                  {currentTag.content || 'Empty'}
                </Text>
              </View>
              <TouchableOpacity
                style={[s.infoButton, { backgroundColor: theme.accentSoft }]}
                onPress={() => setShowModal(true)}
              >
                <Ionicons name="code-slash-outline" size={14} color={theme.accent} />
                <Text style={[s.infoButtonText, { color: theme.accent }]}>Raw data</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Step 2 — Write */}
      <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Step 2 — Write new URL</Text>
      <View style={[s.card, { backgroundColor: theme.surface }]}>
        <View style={s.inputGroup}>
          <Text style={[s.inputLabel, { color: theme.textMuted }]}>Card name</Text>
          <TextInput
            style={[s.input, { backgroundColor: theme.bg, borderColor: focusedInput === 'label' ? theme.accent : 'transparent', color: theme.text }]}
            placeholder={t('config.labelPlaceholder')}
            placeholderTextColor={theme.textMuted}
            value={label}
            onChangeText={setLabel}
            onFocus={() => setFocusedInput('label')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
        <View style={[s.divider, { backgroundColor: theme.bg }]} />
        <View style={s.inputGroup}>
          <Text style={[s.inputLabel, { color: theme.textMuted }]}>Target URL</Text>
          <TextInput
            style={[s.input, { backgroundColor: theme.bg, borderColor: focusedInput === 'url' ? theme.accent : 'transparent', color: theme.text }]}
            placeholder={t('config.urlPlaceholder')}
            placeholderTextColor={theme.textMuted}
            value={url}
            onChangeText={setUrl}
            onFocus={() => setFocusedInput('url')}
            onBlur={() => setFocusedInput(null)}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Write button */}
      <TouchableOpacity
        style={[
          s.writeButton,
          { backgroundColor: writing ? theme.accentSoft : theme.accent },
          (!nfcSupported || !url) && { opacity: 0.5 },
        ]}
        onPress={writing ? handleCancel : handleWrite}
        activeOpacity={0.85}
        disabled={!nfcSupported}
      >
        <Ionicons name={writing ? 'radio-outline' : 'save-outline'} size={18} color="#ffffff" />
        <Text style={s.writeButtonText}>
          {writing ? 'Writing... tap to cancel' : t('config.save')}
        </Text>
      </TouchableOpacity>

      {/* Modal raw data */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalContainer, { backgroundColor: theme.surface }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: theme.text }]}>Raw Tag Data</Text>
              <View style={s.modalActions}>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={[s.modalClose, { backgroundColor: theme.accentSoft }]}
                >
                  <Ionicons name="copy-outline" size={16} color={theme.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={[s.modalClose, { backgroundColor: theme.bg }]}
                >
                  <Ionicons name="close" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[s.modalJson, { color: theme.text }]}>
                {JSON.stringify(currentTag?.raw, null, 2)}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 100 },
  glowTop: { position: 'absolute', top: -100, right: -100, width: 250, height: 250, borderRadius: 125, opacity: 0.07 },
  header: { paddingTop: 60, marginBottom: 20 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 15, marginTop: 6 },
  nfcBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 28 },
  nfcBadgeText: { fontSize: 12, fontWeight: '600' },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
  card: { borderRadius: 18, marginBottom: 28, overflow: 'hidden' },
  nfcButton: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, borderWidth: 1, borderRadius: 18 },
  nfcIconBox: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  nfcButtonInfo: { flex: 1 },
  nfcButtonTitle: { fontSize: 15, fontWeight: '600' },
  nfcButtonSub: { fontSize: 12, marginTop: 2 },
  cancelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  cancelText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  tagResult: { padding: 16, gap: 10 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tagKey: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', width: 70 },
  tagValue: { fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right' },
  infoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 4 },
  infoButtonText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1 },
  inputGroup: { padding: 16 },
  inputLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  writeButton: { borderRadius: 14, paddingVertical: 17, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  writeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalClose: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  modalJson: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 20 },
  modalActions: { flexDirection: 'row', gap: 8 },
});