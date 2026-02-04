import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { CriminalInfo } from '../../data/types';
import { findIPCSectionFromDescription, isSeriousCharge, getIPCSection } from '../../data/ipc-sections';
import { Accordion } from '../ui/Accordion';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { colors } from '../../theme/colors';

// this component handles displaying criminal cases from MP affidavits
// NOTE: presence of cases != guilt, important legal distinction

interface CriminalSectionProps {
  criminal: CriminalInfo;
}

export function CriminalSection({ criminal }: CriminalSectionProps) {
  if (!criminal.hasCases) {
    return (
      <Card className="p-4">
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: colors.semantic.successMuted }}
          >
            <Ionicons name="checkmark-circle" size={28} color={colors.semantic.success} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold" style={{ color: colors.semantic.success }}>
              No Criminal Cases
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: colors.text.tertiary }}>
              Clean record as per election affidavit
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  const summaryText = `${criminal.totalCases} Cases | ${criminal.seriousIPCSections} Serious | ${criminal.otherIPCSections} Other`;

  return (
    <Accordion
      title="Criminal Record"
      subtitle={summaryText}
      variant="danger"
      headerRight={
        <Badge
          label={`${criminal.totalCases}`}
          variant="danger"
        />
      }
    >
      <View className="gap-3 pt-3">
        {/* stats row */}
        <View className="flex-row gap-2 mb-2">
          <View
            className="flex-1 rounded-xl p-3"
            style={{ backgroundColor: colors.semantic.dangerMuted }}
          >
            <Text className="text-2xl font-bold" style={{ color: colors.semantic.danger }}>
              {criminal.totalCases}
            </Text>
            <Text className="text-xs" style={{ color: colors.semantic.danger, opacity: 0.8 }}>
              Total Cases
            </Text>
          </View>
          <View
            className="flex-1 rounded-xl p-3"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
          >
            <Text className="text-2xl font-bold" style={{ color: colors.accent.amber }}>
              {criminal.seriousIPCSections}
            </Text>
            <Text className="text-xs" style={{ color: colors.accent.amber, opacity: 0.8 }}>
              Serious IPC
            </Text>
          </View>
          <View
            className="flex-1 rounded-xl p-3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <Text className="text-2xl font-bold" style={{ color: colors.text.secondary }}>
              {criminal.otherIPCSections}
            </Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>
              Other IPC
            </Text>
          </View>
        </View>

        {/* charges table */}
        {criminal.charges.length > 0 && (
          <View className="bg-white/[0.03] rounded-xl overflow-hidden">
            {/* table header */}
            <View className="flex-row bg-white/5 px-3 py-2.5 items-center">
              <View className="flex-1">
                <Text
                  className="text-xs font-semibold uppercase"
                  style={{ color: colors.text.muted }}
                >
                  Charges
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text
                  className="text-xs font-semibold uppercase w-12 text-center"
                  style={{ color: colors.text.muted }}
                >
                  IPC
                </Text>
                <Text
                  className="text-xs font-semibold uppercase w-12 text-center ml-3"
                  style={{ color: colors.text.muted }}
                >
                  BNS
                </Text>
                <Text
                  className="text-xs font-semibold uppercase w-8 text-center ml-3"
                  style={{ color: colors.text.muted }}
                >
                  #
                </Text>
              </View>
            </View>

            {/* charges list - sorted with serious ones first */}
            {[...criminal.charges]
              .map((charge) => {
                // try to match IPC section from the charge data or description
                const ipcSection = charge.ipcSection
                  ? getIPCSection(charge.ipcSection)
                  : findIPCSectionFromDescription(charge.description);
                const isSerious = ipcSection?.isSerious ?? isSeriousCharge(charge.description);
                return { charge, ipcSection, isSerious };
              })
              .sort((a, b) => (a.isSerious === b.isSerious ? 0 : a.isSerious ? -1 : 1))
              .map(({ charge, ipcSection, isSerious }, idx) => (
                <View
                  key={`${charge.description}-${idx}`}
                  className="px-3 py-3"
                  style={{ borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: 'rgba(255,255,255,0.05)' }}>
                  <Text
                    className="text-sm mb-2"
                    style={{ color: isSerious ? colors.accent.amber : colors.text.secondary }}>
                    {charge.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    {/* category badge if we have one */}
                    {ipcSection?.category && (
                      <View
                        className="rounded-full px-2.5 py-1"
                        style={{
                          backgroundColor: isSerious
                            ? 'rgba(251, 191, 36, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <Text
                          className="text-xs"
                          style={{ color: isSerious ? colors.accent.amber : colors.text.muted }}
                        >
                          {ipcSection.category}
                        </Text>
                      </View>
                    )}
                    {!ipcSection?.category && <View />}
                    {/* IPC + BNS + count badges */}
                    <View className="flex-row items-center">
                      <View
                        className="w-12 h-6 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: (ipcSection || charge.ipcSection)
                            ? 'rgba(251, 191, 36, 0.15)'
                            : 'transparent',
                        }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{
                            color: (ipcSection || charge.ipcSection)
                              ? colors.accent.amber
                              : colors.text.muted,
                          }}
                        >
                          {ipcSection?.section || charge.ipcSection || '—'}
                        </Text>
                      </View>
                      {/* BNS section (new law that replaced IPC) */}
                      <View
                        className="w-12 h-6 rounded-full items-center justify-center ml-3"
                        style={{
                          backgroundColor:
                            ipcSection?.bnsSection && ipcSection.bnsSection !== 'Omitted'
                              ? 'rgba(34, 211, 238, 0.15)'
                              : 'transparent',
                        }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{
                            color:
                              ipcSection?.bnsSection === 'Omitted'
                                ? colors.semantic.danger
                                : ipcSection?.bnsSection
                                  ? colors.accent.cyan
                                  : colors.text.muted,
                          }}
                        >
                          {ipcSection?.bnsSection || '—'}
                        </Text>
                      </View>
                      {/* count */}
                      <View
                        className="w-8 h-6 rounded-full items-center justify-center ml-3"
                        style={{
                          backgroundColor: isSerious
                            ? 'rgba(251, 191, 36, 0.15)'
                            : 'rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color: isSerious ? colors.accent.amber : colors.text.primary,
                          }}
                        >
                          {charge.count}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* legend for IPC/BNS abbreviations */}
        <View className="flex-row items-center justify-center gap-3 mt-1">
          <View className="flex-row items-center">
            <View
              className="px-2 py-1 rounded-full mr-1.5"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
            >
              <Text className="text-xs font-medium" style={{ color: colors.accent.amber }}>
                IPC
              </Text>
            </View>
            <Text className="text-xs" style={{ color: colors.accent.amber }}>
              Indian Penal Code
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="px-2 py-1 rounded-full mr-1.5"
              style={{ backgroundColor: 'rgba(34, 211, 238, 0.15)' }}
            >
              <Text className="text-xs font-medium" style={{ color: colors.accent.cyan }}>
                BNS
              </Text>
            </View>
            <Text className="text-xs" style={{ color: colors.accent.cyan }}>
              Bharatiya Nyaya Sanhita
            </Text>
          </View>
        </View>

        {/* disclaimer - legally important! */}
        <View className="rounded-xl p-3 mt-1" style={{ backgroundColor: colors.semantic.warningMuted }}>
          <View className="flex-row items-start">
            <Ionicons
              name="information-circle"
              size={18}
              color={colors.semantic.warning}
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-xs ml-2" style={{ color: colors.semantic.warning }}>
              These are cases declared in the election affidavit. Being charged does not imply guilt;
              all individuals are presumed innocent until proven guilty.
            </Text>
          </View>
        </View>
      </View>
    </Accordion>
  );
}
