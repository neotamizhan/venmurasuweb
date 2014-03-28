require "json"
require "date"
require "rss"

def get_next_url(last_date)
	next_date = last_date + 1
	"http://www.venmurasu.in/#{next_date.year}/#{next_date.month.to_s.rjust(2,'0')}/#{next_date.day}/feed"
end

data = JSON.parse(File.read("../data.json",:encoding => 'utf-8'))

last_data = data[-1]

last_date = Date.strptime(last_data['published_on'],'%d-%m-%Y')

next_date = last_date + 1

p last_date
url = get_next_url(last_date)

open(url) do |rss|
  feed = RSS::Parser.parse(rss)
  puts "Title: #{feed.channel.title}"
  feed.items.each do |item|
    puts "Item: #{item.link}"
  end
end

__END__

{
	"novelno":2,
	"novelname":"மழைப்பாடல்",	
	"sectionno":6,
	"sectionname":"தூரத்துச் சூரியன்",	
	"chapter":27,
	"published_on":"22-03-2014",
	"url":"http://venmurasu.in/2014/03/22/%e0%ae%a8%e0%af%82%e0%ae%b2%e0%af%8d-%e0%ae%87%e0%ae%b0%e0%ae%a3%e0%af%8d%e0%ae%9f%e0%af%81-%e0%ae%ae%e0%ae%b4%e0%af%88%e0%ae%aa%e0%af%8d%e0%ae%aa%e0%ae%be%e0%ae%9f%e0%ae%b2%e0%af%8d-27/",
	"image":"http://www.jeyamohan.in/wp-content/uploads/2014/03/VENMURASU_EPI_77_-.jpg",
	"tags":["ஆனகன்","கதாதனன்","கரிணி","காகானீகன்","காவுகன்","கிருதபர்வன்","சத்ருக்னன்","சம்பை","சிக்‌ஷை","சியாமகன்","சியாமை","சிரு குடி","சிருஞ்சயன்","சிலாமுகம்","சூரசேனர்","தசபதம்","தேவசிரவஸ்","தேவபாகன்","தேவவாஹன்","பத்மை","பிருதை","மதுவனம்","மரீஷை","மழைப்பாடல்","யாதவர்குலம்","லவணர்கள்","வத்ஸன்","வாசுதேவன்","விருஷ்ணிகள்","வைரி குடி","ஹேகயவம்சம்","ஹ்ருதீகர்"]
}