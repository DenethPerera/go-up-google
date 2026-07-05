import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

import { submitLocation, CreateLocationPayload } from '../services/location.service';
import { LocationDocument } from '../types';

interface UseSubmitLocationOptions {
  onSuccess?: (data: LocationDocument) => void;
}


export function useSubmitLocation({ onSuccess }: UseSubmitLocationOptions = {}) {
  return useMutation<LocationDocument, Error, CreateLocationPayload>({
    mutationFn: submitLocation,

    onSuccess: async (data) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Location Sync Complete ✅',
        'The location information has been successfully uploaded.',
        [{ text: 'Acknowledge', onPress: () => onSuccess?.(data) }]
      );
    },

    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Submission Failed',
        error.message ?? 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });
}
