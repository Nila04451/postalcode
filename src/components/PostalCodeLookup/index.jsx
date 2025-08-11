import { useState } from 'react';
import { fetchLocationByPostalCode } from './services';
import styles from './styles.module.css';

const PostalCodeLookup = () => {
  const [postalCode, setPostalCode] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!postalCode || !/^[1-9][0-9]{5}$/.test(postalCode)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setLoading(true);
    setError(null);
    setLocationData(null);
    
    try {
      const postOffices = await fetchLocationByPostalCode(postalCode);
      
      // Take the first result (you can modify to show all if needed)
      const firstResult = postOffices[0];
      
      setLocationData({
        postalCode: postalCode,
        postOffice: firstResult.Name,
        district: firstResult.District,
        state: firstResult.State,
        country: "India",
        region: firstResult.Region,
        deliveryStatus: firstResult.DeliveryStatus,
        division: firstResult.Division,
        circle: firstResult.Circle
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Indian Postal Code Finder</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPostalCode(value);
          }}
          placeholder="Enter 6-digit PIN code (e.g., 110001)"
          required
          pattern="[1-9][0-9]{5}"
          title="Please enter a 6-digit Indian PIN code (1-9 followed by 5 digits)"
          maxLength="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Searching...
            </>
          ) : 'Search'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && !error && (
        <div className={styles.loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity=".5"/>
            <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8z">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </path>
          </svg>
          <span>Fetching location details...</span>
        </div>
      )}

      {locationData && (
        <div className={styles.results}>
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Location Details
          </h3>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>PIN Code:</span>
              <span className={styles.detailValue}>{locationData.postalCode}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Post Office:</span>
              <span className={styles.detailValue}>{locationData.postOffice}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>District:</span>
              <span className={styles.detailValue}>{locationData.district}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>State:</span>
              <span className={styles.detailValue}>{locationData.state}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Region:</span>
              <span className={styles.detailValue}>{locationData.region}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Division:</span>
              <span className={styles.detailValue}>{locationData.division}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Circle:</span>
              <span className={styles.detailValue}>{locationData.circle}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Delivery Status:</span>
              <span className={styles.detailValue}>
                <span className={`${styles.status} ${locationData.deliveryStatus === 'Delivery' ? styles.delivery : styles.nonDelivery}`}>
                  {locationData.deliveryStatus}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostalCodeLookup;