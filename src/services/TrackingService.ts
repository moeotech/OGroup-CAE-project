import { v4 as uuidv4 } from 'uuid';

export type EventType = 
  | 'page_view'
  | 'video_play'
  | 'video_watch_duration'
  | 'ad_impression'
  | 'cta_click'
  | 'lead_submitted'
  | 'identity_merged';

interface EventPayload {
  [key: string]: any;
}

class TrackingService {
  private readonly GUEST_ID_KEY = 'ogroup_guest_id';
  private guestId: string;
  private endpoint = '/api/v1/tracking/events'; // Mock endpoint

  constructor() {
    this.guestId = this.initSession();
  }

  /**
   * Initializes or retrieves the guest session ID (Shadow Profile).
   */
  private initSession(): string {
    let id = localStorage.getItem(this.GUEST_ID_KEY);
    if (!id) {
      id = `g_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
      localStorage.setItem(this.GUEST_ID_KEY, id);
    }
    return id;
  }

  public getGuestId(): string {
    return this.guestId;
  }

  /**
   * Core tracking method to send events to the backend.
   */
  public trackEvent(type: EventType, payload: EventPayload = {}) {
    const event = {
      guest_id: this.guestId,
      event_type: type,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      user_agent: navigator.userAgent,
      payload,
    };

    // In a real application, this would use fetch or navigator.sendBeacon
    console.log(`[TrackingService] Event Logged: ${type}`, event);

    // Mock API call
    /*
    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true, // Useful for page unloads
    }).catch(console.error);
    */
  }

  // --- Specific Event Helpers ---

  public trackPageView(pageSlug: string, category: string) {
    this.trackEvent('page_view', { pageSlug, category });
  }

  public trackVideoView(videoId: string, platform: string) {
    this.trackEvent('video_play', { videoId, platform });
  }

  public trackAdImpression(campaignId: string, advertiserId: string) {
    this.trackEvent('ad_impression', { campaignId, advertiserId });
  }

  public trackCTAClick(campaignId: string, actionType: 'whatsapp' | 'call' | 'form') {
    this.trackEvent('cta_click', { campaignId, actionType });
  }

  /**
   * Phase 3: Identity Merging. 
   * Called when the user submits explicit info (e.g., phone number).
   */
  public identifyUser(phoneNumber: string, leadId?: string) {
    this.trackEvent('identity_merged', { 
      phone_number: phoneNumber, 
      lead_id: leadId,
      previous_guest_id: this.guestId 
    });
    console.log(`[TrackingService] Identity Merged for Guest ${this.guestId} -> Phone ${phoneNumber}`);
  }
}

export const tracker = new TrackingService();
