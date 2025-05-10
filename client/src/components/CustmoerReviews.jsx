import React from 'react'

function CustmoerReviews() {
  return (
    <div>
          <section className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-gray-400 p-6 rounded-xl shadow-md w-80">
              <p className="italic mb-4">“Very reliable and professional service.”</p>
              <div className="flex items-center justify-center gap-2">
                <img src="./images/man1.jpeg" alt="John D." className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">John D.</p>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CustmoerReviews